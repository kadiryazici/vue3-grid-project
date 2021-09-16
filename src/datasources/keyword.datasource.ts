import type { IServerSideDatasource } from 'ag-grid-community';

export const createKeywordDataSource = (): IServerSideDatasource => ({
   getRows(params) {
      console.log(params.request);
   }
});
