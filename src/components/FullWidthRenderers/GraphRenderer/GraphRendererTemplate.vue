<script lang="ts" setup>
import type { KeywordResponse } from '$types';
import type { ICellRendererParams } from 'ag-grid-community';

import { computed, ref, onMounted, unref, nextTick, watchEffect } from 'vue';
import ApexCharts, { ApexOptions } from 'apexcharts';

import { GraphRendererHeight } from './graph.renderer';
import { fetchSearchVolume } from '$api/SearchVolume';
import { useMainStore } from '/src/stores/mainStore';
import { transformNumber } from '$helpers/transformNumber';

import IconClose from 'virtual:icons/icon-park-outline/close';

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

const [volumeData, isError] = await fetchSearchVolume(keywordData.value);

const apexOptions = ref<ApexOptions>({
   series: [{ data: volumeData.map((v) => v.volume), name: 'Volume' }],
   chart: {
      height: GraphRendererHeight - 100,
      type: 'bar',
      toolbar: {
         show: false
      }
   },
   colors: ['#2E93fA'],
   legend: {
      show: false
   },
   yaxis: {
      labels: {
         formatter: transformNumber
      }
   },
   xaxis: {
      categories: volumeData.map((v) => v.date),
      labels: {
         style: {
            colors: ['#2E93fA'],
            fontSize: '12px'
         }
      }
   }
});

watchEffect(() => {
   const { style } = apexOptions.value.xaxis!.labels!;
   if (mainStore.isDarkMode) {
      style!.colors = [lightText];
   } else {
      style!.colors = [darkText];
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
   await nextTick();
   // manuel olarak bir kere güncellenmesi gerekiyor yoksa derlenmiyor niyeyse
   chart.updateOptions(unref(apexOptions)!);
   unref(graphRenderer)!.scrollIntoView();
});
</script>

<template>
   <div :style="[cssHeightVar]" class="graph-renderer">
      <div class="bar">
         <h2 class="graph-title">{{ keywordData.keyword }}</h2>
         <div @click="closeRenderer" role="button" class="close"><IconClose /></div>
      </div>
      <div ref="graphRenderer"></div>
   </div>
</template>

<!-- scoped olmamalı çünkü Ag-Grid style destekli derlemiyor -->
<style lang="scss">
.graph-renderer {
   @apply w-full overflow-hidden;
   height: var(--height);
   animation: openRendererAnim 0.5s ease;
   .bar {
      @apply flex w-full justify-between py-5 px-3 box-border;
      .graph-title {
         @apply m-0 inline-block text-blue-500;
      }
      .close {
         @apply text-blue-500 cursor-pointer text-size-20px;
      }
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
