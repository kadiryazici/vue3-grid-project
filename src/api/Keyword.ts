import { KeywordBody, KeywordResponse } from '$types';

import { KEYWORD_SEARCH_LIMIT } from '/src/configs/defaults';
import { SEARCH_KEYWORD_URL } from '$api/_vars';
import { makeFetch } from '$helpers/makeFetch';
import { useAsyncData } from '$helpers/asyncData';

/**
 * For SSR + Client Hydration fetching inside script setup.
 * @important Should only be used in `SETUP`
 */
export const useAsyncKeywordData = (
   {
      domain,
      firstDate = '2020-01-01',
      lastDate = '2020-02-20',
      limit = KEYWORD_SEARCH_LIMIT,
      page = 1
   }: Partial<KeywordBody>,
   onError?: (error: any) => void
) => {
   return useAsyncData<KeywordResponse[]>('IndexPageKeywordAsyncData', SEARCH_KEYWORD_URL, {
      onError,
      fetchConfig: {
         method: 'POST',
         body: JSON.stringify({ domain, firstDate, lastDate, limit, page })
      }
   });
};

/**
 * For manual fetching.
 */
export const fetchKeywordData = ({
   domain,
   firstDate = '2020-01-01',
   lastDate = '2020-02-20',
   limit = KEYWORD_SEARCH_LIMIT,
   page = 1
}: Partial<KeywordBody>) => {
   return makeFetch<KeywordResponse[]>(SEARCH_KEYWORD_URL, {
      method: 'POST',
      body: JSON.stringify({ domain, firstDate, lastDate, limit, page })
   });
};
