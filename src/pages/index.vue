<script lang="ts" setup>
import type { RowClickedEvent, GridOptions, GridReadyEvent, GridApi, ColumnApi, RowNode } from 'ag-grid-community';
import type { KeywordResponse } from '$types';

import { AgGridVue } from 'ag-grid-vue3';
import { ref, unref, watch } from 'vue';
import debounce from 'lodash.debounce';

import { useAsyncKeywordData, fetchKeywordData } from '$api/Keyword';
import { useMainStore } from '/src/stores/mainStore';
import { AgGridDefaultOptions } from '/src/configs/agGrid';
import RedGreenCellRenderer from '../components/CellRenderers/RedGreenCellRenderer.vue';
import { createKeywordDataSource } from '/src/datasources/keyword.datasource';
import { GraphRendererHeight } from '/src/components/FullWidthRenderers/GraphRenderer/graph.renderer';
import { GraphRenderer } from '/src/components/FullWidthRenderers/GraphRenderer/graph.renderer';
import { VolumeCellRenderer } from '/src/components/CellRenderers/VolumeCell.renderer';
import { RankCellRenderer } from '/src/components/CellRenderers/RankCellRenderer';

type ColumnDefs = GridOptions['columnDefs'];
type Field = keyof KeywordResponse;

const mainStore = useMainStore();

const query = ref('akakce.com');
const page = ref(1);
const gridApi = ref(null as GridApi | null);
const columnApi = ref(null as ColumnApi | null);

// Sütunların isimleri ve ayarları.
const columnDefs: ColumnDefs = [
   { field: 'keyword' as Field },
   { field: 'landingPage' as Field },
   { field: 'rank' as Field, cellRendererFramework: RankCellRenderer },
   { field: 'diffRank' as Field, cellRendererFramework: RedGreenCellRenderer },
   { field: 'pixelRank' as Field, cellRendererFramework: RedGreenCellRenderer },
   { field: 'diffPixelRank' as Field, cellRendererFramework: RedGreenCellRenderer },
   { field: 'cpc' as Field },
   { field: 'avgSearchVolume' as Field, cellRendererFramework: VolumeCellRenderer }
];

/**
 * SSR yapamadığım için burada onMounted olduğunda çekiyor veriyi. Scripti bloklamıyor.
 */
const rowData = await useAsyncKeywordData({ domain: unref(query), page: unref(page) }, (err) => {
   console.error(err);
});

// dinamik olarak tüm verilere isClicked ekliyor ki ileride açık olup olmadığını kontrol edeyim.
watch(rowData, (newRowData) => {
   if (!newRowData) return;
   const isAlreadyWatched = newRowData.every((v) => typeof v.isClicked !== 'undefined');
   if (isAlreadyWatched) return;

   rowData.value = newRowData.map((rowdata) => {
      return { ...rowdata, isClicked: false };
   });
});

const componentGridOptions: GridOptions = {
   pagination: true,
   getRowHeight(params) {
      if ((params.data as KeywordResponse).isClicked) {
         return GraphRendererHeight;
      }
   },
   fullWidthCellRendererFramework: GraphRenderer,
   defaultColDef: {
      autoHeight: true
   },
   ...AgGridDefaultOptions
   // paginationPageSize: 10,
   // rowModelType: 'infinite',
};

/**
 * Query ya da Page değiştiğinde bu watcher çalışacak.
 */
watch([query, page], (newData) => debouncedFetchNewData(newData));

/**
 * Geciktirilmiş fonksiyon. Bu fonksiyon çağırıldığında eğer 300 milisaniye boyunca tekrar çağırılmaz ise çalışacak
 * eğer tekrar çağırılırsa yine baştan 300 milisaniye bekleyecek.
 */
const debouncedFetchNewData = debounce(async ([newQuery, newPage]: [string, number]) => {
   if (newQuery.length <= 0 || newPage <= 0) {
      rowData.value = [];
      return;
   }
   const [data, isError, response] = await fetchKeywordData({ domain: newQuery, page: newPage });
   if (isError) {
      rowData.value = [];
      console.log(response);
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

function onGridReady(params: GridReadyEvent) {
   return;
   gridApi.value = params.api;
   columnApi.value = params.columnApi;
   // enterprise istiyor
   const dataSource = createKeywordDataSource();
   params.api.setServerSideDatasource(dataSource);
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
         <span class="label">Sayfa:</span>
         <input class="vi-input-text w-50px ml-2" v-model="page" type="number" />
      </div>

      <AgGridVue
         :class="[mainStore.isDarkMode ? 'ag-theme-alpine-dark' : 'ag-theme-alpine']"
         class="w-full h-550px"
         :columnDefs="columnDefs"
         :rowData="rowData"
         @gridReady="onGridReady"
         @cellClicked="onCellClicked"
         :isFullWidthCell="isFullWidth"
         :gridOptions="componentGridOptions"
      ></AgGridVue>
   </div>
</template>

<style lang="scss" scoped>
#main-page {
   @apply px-5 py-3;
   .top-section {
      @apply .dark:text-white mb-3 flex w-full box-border items-center;
      .label {
         @apply mb-1 text-size-15px font-bold;
      }
   }
}
@include forMobile {
   #main-page {
      @apply px-3;
   }
}
</style>
