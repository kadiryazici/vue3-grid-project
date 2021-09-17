import type { IServerSideDatasource, PaginationProxy } from '@ag-grid-enterprise/all-modules';

import { fetchKeywordData } from '$api/Keyword';

// nedense fetchKeywordData fonksiyonunu getrows içinde çağırınca
// cors hatası alıyorum ve istek kapanıyor. Çok garip.
// const fetchData = async (params: Parameters<typeof fetchKeywordData>['0']) => await fetchKeywordData(params);

export const createKeywordDataSource = (): IServerSideDatasource => ({
   async getRows(params) {
      // const currentPage = params.api.paginationProxy as unknown as PaginationProxy;
      const page = params.api.paginationGetCurrentPage() + 1;
      const [data, isError, response] = await fetchKeywordData({ domain: 'akakce.com', page });
      if (!isError) {
         params.success({
            rowData: data.map((rowdata) => {
               return { ...rowdata, isClicked: false };
            })
         });
         return;
      }
      params.fail();
   }
});
