import type { GridOptions } from 'ag-grid-community';
import { reactive } from 'vue';

export const AgGridDefaultOptions: GridOptions = reactive({
   defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      flex: 1,
      minWidth: 100,
      autoHeight: true
   },
   suppressCellSelection: true,
   suppressRowClickSelection: true,
   // groupSelectsChildren: true,
   debug: import.meta.env.DEV ? true : false
   // rowSelection: 'multiple',
   // rowGroupPanelShow: 'always',
   // pivotPanelShow: 'always'
   // enableRangeSelection: true,
   // pagination: true
});
