import 'ag-grid-community/dist/styles/ag-grid.css';
import 'virtual:windi.css';

import App from './App.vue';
import { createHead } from '@vueuse/head';
import { createPinia } from 'pinia';
import routes from 'virtual:generated-pages';
import { viteSSR } from 'vite-ssr/vue';

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

   console.log({
      piniaState: pinia.state.value
   });
   return { head };
});
