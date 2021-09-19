import 'virtual:windi.css';
import 'ag-grid-enterprise/dist/styles/ag-grid.css';
import 'ag-grid-enterprise';
import 'bottom-sheet-vue3/css/style.css';

import App from './App.vue';
import { LicenseManager } from 'ag-grid-enterprise';
import { createHead } from '@vueuse/head';
import { createPinia } from 'pinia';
import { license } from '/src/apply-ag-grid-license';
import routes from 'virtual:generated-pages';
import { useMainStore } from '/src/stores/mainStore';
import { viteSSR } from 'vite-ssr/vue';
import { watchEffect } from 'vue';

// import {Modul} from '@ag-grid-enterprise/core'

LicenseManager.setLicenseKey(license);

const SSROptions: Parameters<typeof viteSSR>['1'] = {
   routes,
   pageProps: {
      passToPage: false
   }
};

export default viteSSR(App, SSROptions, (context) => {
   const { initialState, app } = context;
   const pinia = createPinia();
   const head = createHead();
   app.use(pinia).use(head);

   const mainStore = useMainStore(pinia);
   // Dinamik olarak karanlık ve açık tema renklerini çekiyorum
   // böylece 160kb tasarruf sağlamış oluyorum
   // vite her seferinde internetten çekmeyecek kadar akıllı.
   watchEffect(() => {
      if (mainStore.isDarkMode) {
         import('ag-grid-enterprise/dist/styles/ag-theme-alpine-dark.css');
      } else {
         import('ag-grid-enterprise/dist/styles/ag-theme-alpine.css');
      }
   });

   return { head };
});
