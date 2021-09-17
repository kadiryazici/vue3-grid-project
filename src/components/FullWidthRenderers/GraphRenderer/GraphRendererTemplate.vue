<script lang="ts" setup>
import type { KeywordResponse } from '$types';
import type { ICellRendererParams } from '@ag-grid-enterprise/all-modules';

import { computed, ref, onMounted, unref, nextTick, watchEffect } from 'vue';
import ApexCharts, { ApexOptions } from 'apexcharts';

import { GraphRendererHeight } from './graph.renderer';
import { fetchSearchVolume } from '$api/SearchVolume';
import { useMainStore } from '/src/stores/mainStore';
import { transformNumber } from '$helpers/transformNumber';

import IconClose from 'virtual:icons/icon-park-outline/close';
import { getCSSVar } from '$helpers/getCSSVar';

const props = defineProps<{
   params: ICellRendererParams;
}>();

const mainStore = useMainStore();

const cssHeightVar = `--height: ${GraphRendererHeight}px`;
const [lightText, darkText] = ['#ffffff', '#1e1f1e'];
let chart = null as null | ApexCharts;

const params = computed(() => props.params);
const graphRenderer = ref(null as HTMLDivElement | null);
const keywordData = computed(() => params.value.node.data as KeywordResponse);

const [volumeData, isError, response] = await fetchSearchVolume(keywordData.value);
if (isError) {
   console.error({ data: volumeData, response });
}

const apexOptions = ref<ApexOptions>({
   series: [{ data: volumeData.map((v) => v.volume), name: 'Volume' }],
   chart: {
      height: GraphRendererHeight - 100,
      type: 'bar',
      toolbar: {
         show: false
      }
   },
   colors: ['var(--color-accent)'],
   // legend: {
   //    show: false
   // },
   yaxis: {
      labels: {
         formatter: transformNumber
      }
   },
   xaxis: {
      categories: volumeData.map((v) => v.date),
      labels: {
         style: {
            colors: Array(volumeData.length).fill(lightText),
            fontSize: '12px'
         }
      }
   }
});

watchEffect(() => {
   const { style } = apexOptions.value.xaxis!.labels!;

   if (mainStore.isDarkMode) {
      style!.colors = Array(volumeData.length).fill(lightText);
   } else {
      style!.colors = Array(volumeData.length).fill(darkText);
   }

   chart && chart.updateOptions(apexOptions.value);
});

function closeRenderer() {
   (unref(params).node.data as KeywordResponse).isClicked = false;
}

onMounted(async () => {
   if (!graphRenderer.value) return;

   chart = new ApexCharts(unref(graphRenderer)!, unref(apexOptions)!);
   await chart.render();
   // manuel olarak bir kere güncellenmesi gerekiyor yoksa derlenmiyor niyeyse
   await nextTick();
   chart.updateOptions(unref(apexOptions)!);
   unref(graphRenderer)!.scrollIntoView();
});
</script>

<template>
   <div :style="[cssHeightVar]" class="graph-renderer">
      <div class="bar">
         <h2 class="graph-title">SEARCH VOLUME: {{ keywordData.avgSearchVolume }}</h2>
         <div @click="closeRenderer" role="button" class="close"><IconClose /></div>
      </div>
      <div class="subtext">{{ keywordData.keyword }}</div>
      <div ref="graphRenderer"></div>
   </div>
</template>

<!-- scoped olmamalı çünkü Ag-Grid style destekli derlemiyor -->
<style lang="scss">
.graph-renderer {
   @apply w-full overflow-hidden px-4 box-border;
   height: var(--height);
   animation: openRendererAnim 0.5s ease;
   .bar {
      @apply flex w-full justify-between py-5 pt-9 px-3 box-border;
      .graph-title {
         @apply m-0 inline-block text-[var(--color-accent)];
      }
      .close {
         @apply text-[var(--color-accent)] cursor-pointer text-size-20px;
      }
   }
   .subtext {
      @apply px-3 text-size-15px py-2 text-[var(--color-accent-dark)];
   }
}

.apexcharts-tooltip-title,
.apexcharts-tooltip-text {
   @apply text-dark-400;
}

@keyframes openRendererAnim {
   from {
      opacity: 0;
      height: calc(var(--height) - 100px);
   }
   to {
      opacity: 1;
      height: var(--height);
   }
}
</style>
