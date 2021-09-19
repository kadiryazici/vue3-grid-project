<script lang="ts" setup>
import type { KeywordResponse } from '$types';
import type { ICellRendererParams } from '@ag-grid-enterprise/all-modules';
import type { ApexOptions } from 'apexcharts';

import { computed, ref, onMounted, unref, nextTick, watchEffect } from 'vue';
import ApexCharts from 'apexcharts';

import { GraphRendererHeight } from './graph.renderer';
import { fetchSearchVolume } from '$api/SearchVolume';
import { transformNumber } from '$helpers/transformNumber';

import IconClose from 'virtual:icons/icon-park-outline/close';
import { getMonthName } from '$helpers/getMonthName';

const props = defineProps<{
   params: ICellRendererParams;
}>();

const cssHeightVar = `--height: ${GraphRendererHeight}px`;
let chart = null as null | ApexCharts;

const apexRoot = ref(null as HTMLDivElement | null);
const keywordData = computed(() => props.params.node.data as KeywordResponse);

const [volumeData, isError, response] = await fetchSearchVolume(keywordData.value);
if (isError) {
   console.error({ data: volumeData, response });
   throw response;
}

const textColors = Array(volumeData.length).fill('var(--color-apex-text)');
const apexOptions = ref<ApexOptions>({
   series: [{ data: volumeData.map((v) => v.volume), name: 'Volume' }],
   chart: {
      height: `${GraphRendererHeight - 150}px`,
      type: 'bar'
   },
   colors: ['var(--color-accent)'],
   yaxis: {
      labels: {
         formatter: transformNumber,
         style: {
            colors: textColors
         }
      }
   },
   xaxis: {
      categories: volumeData.map((v) => getMonthName(v.date).toUpperCase().slice(0, 3)),
      labels: {
         style: {
            colors: textColors,
            fontSize: '12px'
         }
      }
   }
});

function closeRenderer() {
   (props.params.node.data as KeywordResponse).isClicked = false;
}

onMounted(async () => {
   const root = unref(apexRoot);
   const options = unref(apexOptions);
   if (!root) return;

   chart = new ApexCharts(root, options);
   await chart.render();
   // manuel olarak bir kere güncellenmesi gerekiyor yoksa derlenmiyor niyeyse
   await nextTick();
   chart.updateOptions(options);
   root.scrollIntoView();
});
</script>

<template>
   <div :style="[cssHeightVar]" class="graph-renderer">
      <div class="bar">
         <h2 class="graph-title">SEARCH VOLUME: {{ keywordData.avgSearchVolume }}</h2>
         <div @click="closeRenderer" role="button" class="close"><IconClose /></div>
      </div>
      <div class="subtext">{{ keywordData.keyword }}</div>
      <div class="apex-root" ref="apexRoot"></div>
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
