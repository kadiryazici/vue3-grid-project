<script lang="ts" setup>
import type { KeywordResponse } from '$types';
import type { ICellRendererParams } from '@ag-grid-enterprise/all-modules';
import type { ApexOptions } from 'apexcharts';

import { computed, ref, onMounted, unref, nextTick } from 'vue';
import ApexCharts from 'apexcharts';

import { GraphRendererHeight } from './graph.renderer';
import { fetchSearchVolume } from '$api/SearchVolume';
import { transformNumber } from '$helpers/transformNumber';

import IconClose from 'virtual:icons/icon-park-outline/close';
import { getMonthName } from '$helpers/getMonthName';

const props = defineProps<{
   params: ICellRendererParams;
   modal?: boolean;
   modalCloser: () => void;
}>();

const cssHeightVar = `--height: ${GraphRendererHeight}px`;
let chart = null as null | ApexCharts;

const apexRoot = ref(null as HTMLDivElement | null);
const wrapper = ref(null as HTMLDivElement | null);
const keywordData = computed(() => props.params.node.data as KeywordResponse);

const [volumeData, isError, response] = await fetchSearchVolume(keywordData.value);
if (isError) {
   console.error({ data: volumeData, response });
   throw response;
}

const textColors = Array(volumeData.length).fill('var(--color-reversed)');
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
   if (props.modal) {
      props.modalCloser();
      return;
   }
   (props.params.node.data as KeywordResponse).isClicked = false;
}

onMounted(async () => {
   const root = unref(apexRoot);
   const _wrapper = unref(wrapper);
   const options = unref(apexOptions);
   if (!root || !_wrapper) return;

   chart = new ApexCharts(root, options);
   await chart.render();
   // manuel olarak bir kere güncellenmesi gerekiyor yoksa derlenmiyor niyeyse
   await nextTick();
   chart.updateOptions(options);
   setTimeout(() => {
      _wrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
   }, 250);
});
</script>

<template>
   <div :class="{ modal: props.modal }" ref="wrapper" :style="[cssHeightVar]" class="graph-renderer">
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

   &:not(.modal) {
      animation: openRendererAnim 0.25s ease;
   }
   &.modal {
      animation: modalAnimation 0.25s;
   }

   .bar {
      @apply flex w-full justify-between py-5 pt-9 px-3 box-border;
      .graph-title {
         @apply m-0 inline-block text-[var(--color-accent)];
         font-size: calc(17px + 0.5vw);
      }
      .close {
         @apply text-[var(--color-accent)] cursor-pointer text-size-20px;
      }
   }

   .subtext {
      @apply px-3 text-size-15px py-2 text-[var(--color-reversed)];
   }
}

.apexcharts-tooltip-title,
.apexcharts-tooltip-text {
   @apply text-dark-400;
}

@keyframes openRendererAnim {
   from {
      opacity: 0;
      transform: translateY(-100px);
   }
   to {
      opacity: 1;
      transform: translateY(0px);
   }
}

@keyframes modalAnimation {
   0% {
      height: 0px;
   }
   99% {
      height: var(--height);
   }
}
</style>
