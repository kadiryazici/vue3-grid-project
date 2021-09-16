export interface KeywordBody {
   firstDate: string;
   lastDate: string;
   domain: string;
   limit: number;
   page: number;
}
export interface KeywordResponse {
   keyword: string;
   landingPage: string;
   rank: number;
   diffRank: number;
   pixelRank: number;
   diffPixelRank: number;
   cpc: number;
   avgSearchVolume: number;
   /**
    * Veri çekildiğinde dinamik olarak ekleniyor
    */
   isClicked?: boolean;
}

export interface SearchVolumeBody {
   country: string;
   lang: string;
   keyword: string;
}
export interface SearchVolumeResponse {
   date: string;
   volume: number;
}
