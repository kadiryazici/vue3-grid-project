import type { ColDef, GridOptions } from '@ag-grid-enterprise/all-modules';

import { reactive } from 'vue';

export const AgGridDefaultOptions: GridOptions = reactive({
   defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      flex: 1,
      minWidth: 100
   },
   suppressCellSelection: true,
   suppressRowClickSelection: true,
   suppressMovableColumns: true,
   // groupSelectsChildren: true,
   debug: import.meta.env.DEV ? true : false
   // rowSelection: 'multiple',
   // rowGroupPanelShow: 'always',
   // pivotPanelShow: 'always'
   // enableRangeSelection: true,
   // pagination: true
});

export const noSortCol: ColDef = {
   menuTabs: [],
   sortable: false
};
