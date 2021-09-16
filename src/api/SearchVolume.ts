import { SearchVolumeBody, SearchVolumeResponse } from '$types';

import { SEARCH_VOLUME_URL } from '$api/_vars';
import { makeFetch } from '$helpers/makeFetch';

/**
 * For manual fetching.
 */
export const fetchSearchVolume = ({ country = 'tr', lang = 'tr', keyword }: Partial<SearchVolumeBody>) => {
   return makeFetch<SearchVolumeResponse[]>(SEARCH_VOLUME_URL, {
      method: 'POST',
      body: JSON.stringify({ country, lang, keyword })
   });
};
