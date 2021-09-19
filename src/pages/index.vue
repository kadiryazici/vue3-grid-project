<script lang="ts" setup>
import type { RowClickedEvent, GridOptions, RowNode } from '@ag-grid-enterprise/all-modules';
import type { KeywordResponse } from '$types';

import { AgGridVue } from 'ag-grid-vue3';
import { ref, unref } from 'vue';
import { ignorableWatch } from '@vueuse/core';
import debounce from 'lodash.debounce';

import { useAsyncKeywordData, fetchKeywordData } from '$api/Keyword';
import { useMainStore } from '/src/stores/mainStore';
import { AgGridDefaultOptions } from '/src/configs/agGrid';
import { columnDefs, KEYWORD_SEARCH_LIMIT } from '/src/configs/defaults';

import { GraphRendererHeight } from '/src/components/FullWidthRenderers/GraphRenderer/graph.renderer';
import { GraphRenderer } from '/src/components/FullWidthRenderers/GraphRenderer/graph.renderer';
import LeftIcon from 'virtual:icons/icon-park-outline/left';
import RightIcon from 'virtual:icons/icon-park-outline/right';

const mainStore = useMainStore();

const query = ref('akakce.com');
const page = ref(1);
const perPage = ref(KEYWORD_SEARCH_LIMIT);

const componentGridOptions: GridOptions = {
   ...AgGridDefaultOptions,
   getRowHeight: ({ data }: { data: KeywordResponse }) => (data?.isClicked ? GraphRendererHeight : 40),
   fullWidthCellRendererFramework: GraphRenderer
};

/**
 * SSR yapamadığım için burada onMounted olduğunda çekiyor veriyi. Scripti bloklamıyor.
 */
const rowData = await useAsyncKeywordData({ domain: unref(query), page: unref(page), limit: unref(perPage) }, (err) => {
   console.error(err);
});
// dinamik olarak tüm verilere isClicked ekliyor ki ileride açık olup olmadığını kontrol edeyim.
const { ignoreUpdates: ignoreRowData } = ignorableWatch(rowData, (newRowData) => {
   if (newRowData) {
      ignoreRowData(() => {
         rowData.value = newRowData.map((rowdata) => {
            return { ...rowdata, isClicked: false };
         });
      });
   }
});

/**
 * Query ya da Page değiştiğinde bu watcher çalışacak.
 * Query değiştiğinde page otomatikman 1 olacak ama birbirlerini çalıştırmamaları gerekiyor
 * Bu yüzden ignorableWatch kullanıyorum.
 */
const { ignoreUpdates: ignoreQuery } = ignorableWatch(query, () => debouncedFetchNewData('query'));
const { ignoreUpdates: ignorePage } = ignorableWatch(page, () => debouncedFetchNewData('page'));
const { ignoreUpdates: ignorePerPage } = ignorableWatch(perPage, () => debouncedFetchNewData());
/**
 * Geciktirilmiş fonksiyon. Bu fonksiyon çağırıldığında eğer 300 milisaniye boyunca tekrar çağırılmaz ise çalışacak
 * eğer tekrar çağırılırsa yine baştan 300 milisaniye bekleyecek.
 */
const debouncedFetchNewData = debounce(async (kind?: 'page' | 'query') => {
   if (kind === 'query') {
      ignorePage(() => {
         page.value = 1;
      });
   }

   if (unref(query).length <= 0 || unref(page) <= 0 || unref(perPage) <= 0) {
      rowData.value = [];
      return;
   }
   const [data, isError, response] = await fetchKeywordData({
      domain: unref(query),
      page: unref(page),
      limit: unref(perPage)
   });
   if (isError) {
      rowData.value = [];
      console.error(response);
      return;
   }
   rowData.value = data;
}, 350);

/**
 * Hücreye tıklandığında çalışan event
 */
function onCellClicked(e: RowClickedEvent) {
   const { node } = e;
   (node.data as KeywordResponse).isClicked = !(node.data as KeywordResponse).isClicked;
}

/**
 * Bu ayar ise eğer isClicked=true ise true döndürüyor ve böylece ag-grid'e o satırın derlenmesini istediğimizi belirtiyoruz
 */
function isFullWidth(node: RowNode) {
   return (node.data as KeywordResponse).isClicked;
}
</script>

<template>
   <div id="main-page">
      <div class="top-section">
         <div class="mr-auto flex-nowrap">
            <span class="label">Ara:</span>
            <input placeholder="Aramak için girin" class="vi-input-text ml-2" v-model.trim="query" type="text" />
         </div>
      </div>

      <div class="app-grid-title">Zoe Interview</div>
      <AgGridVue
         :class="[mainStore.isDarkMode ? 'ag-theme-alpine-dark' : 'ag-theme-alpine']"
         class="w-full h-500px"
         :columnDefs="columnDefs"
         :rowData="rowData"
         @cellClicked="onCellClicked"
         :isFullWidthCell="isFullWidth"
         :gridOptions="componentGridOptions"
         :modules="[]"
      ></AgGridVue>
      <div class="pagination">
         <span class="text-size-13px font-bold text-[var(--color-accent)]">Per Page:</span>
         <input min="0" class="vi-input-text w-50px ml-2 mr-4 text-center no-arrows" v-model="perPage" type="number" />

         <LeftIcon @click="page--" role="button" class="pagination-button" />
         <input min="0" class="vi-input-text w-50px mx-1 text-center no-arrows" v-model="page" type="number" />
         <RightIcon @click="page++" role="button" class="pagination-button" />
      </div>
   </div>
</template>

<style lang="scss" scoped>
#main-page {
   @apply px-5 pt-3 pb-15;
   .app-grid-title {
      @apply rounded-t-md bg-white px-3 py-6 text-size-25px font-bold text-[var(--color-accent-dark)];
      @apply dark:(bg-dark-600 text-white);
   }
   .top-section {
      @apply .dark:text-white mb-3 flex w-full box-border items-center;
      .label {
         @apply mb-1 text-size-15px font-bold;
      }
   }

   .pagination {
      @apply w-full flex justify-end items-center bg-white p-2 py-3 box-border .dark:bg-[#222628] rounded-b-md;
      @apply border-none border-transparent border-t-1px .dark:border-t-dark-100 border-t-gray-200 border-solid;
      .pagination-button {
         @apply transition-colors duration-300 select-none;
         @apply text-[var(--color-accent)] cursor-pointer border-1px border-solid border-[var(--color-accent)] rounded-md;
         @apply hover:(text-white bg-[var(--color-accent)]);
      }
   }
}
@include forMobile {
   #main-page {
      @apply px-3;
   }
}
</style>
