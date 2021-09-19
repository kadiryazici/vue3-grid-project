<script lang="ts" setup>
import type {
   RowClickedEvent,
   GridOptions,
   GridReadyEvent,
   GridApi,
   ColumnApi,
   RowNode
} from '@ag-grid-enterprise/all-modules';
import type { KeywordResponse } from '$types';

import { ServerSideStoreType } from '@ag-grid-enterprise/all-modules';
import { AgGridVue } from 'ag-grid-vue3';
import { ref } from 'vue';
// import { AllModules } from '@ag-grid-enterprise/all-modules';

import { useMainStore } from '/src/stores/mainStore';
import { AgGridDefaultOptions } from '/src/configs/agGrid';
import { createKeywordDataSource } from '/src/datasources/keyword.datasource';
import { GraphRendererHeight } from '/src/components/FullWidthRenderers/GraphRenderer/graph.renderer';
import { GraphRenderer } from '/src/components/FullWidthRenderers/GraphRenderer/graph.renderer';
import { columnDefs } from '/src/configs/defaults';

const mainStore = useMainStore();

const query = ref('akakce.com');
const gridApi = ref(null as GridApi | null);
const columnApi = ref(null as ColumnApi | null);

const componentGridOptions: GridOptions = {
   ...AgGridDefaultOptions,
   defaultColDef: {
      ...AgGridDefaultOptions.defaultColDef,
      autoHeight: true
   },
   pagination: true,
   paginationPageSize: 20,
   cacheBlockSize: 20,
   serverSideStoreType: ServerSideStoreType.Partial,
   getRowHeight(params) {
      if ((params.data as KeywordResponse).isClicked) {
         return GraphRendererHeight;
      }
      return 40;
   },
   rowModelType: 'serverSide',
   fullWidthCellRendererFramework: GraphRenderer
   // defaultColDef: {
   //    autoHeight: true
   // },
};
/**
 * Hücreye tıklandığında çalışan event
 */
function onCellClicked(e: RowClickedEvent) {
   const { node } = e;
   let newData = { ...node.data } as KeywordResponse;
   newData.isClicked = true;
   node.setData(newData);
   node.setRowHeight(400, true);
   e.api.redrawRows({
      rowNodes: [node]
   });
}

function onGridReady(params: GridReadyEvent) {
   gridApi.value = params.api;
   columnApi.value = params.columnApi;
   const dataSource = createKeywordDataSource();
   params.api.setServerSideDatasource(dataSource);
}

/**
 * Bu ayar ise eğer isClicked=true ise true döndürüyor ve böylece ag-grid'e o satırın derlenmesini istediğimizi belirtiyoruz
 */
const isFullWidth = (node: RowNode) => (node.data as KeywordResponse)?.isClicked;
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
         class="w-full h-550px"
         :columnDefs="columnDefs"
         @gridReady="onGridReady"
         @cellClicked="onCellClicked"
         :isFullWidthCell="isFullWidth"
         :gridOptions="componentGridOptions"
         :modules="[]"
      ></AgGridVue>
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
