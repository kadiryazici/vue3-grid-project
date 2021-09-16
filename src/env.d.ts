/// <reference types="vite/client" />
/// <reference types="vite-plugin-windicss/dist/client" />
/// <reference types="vite-plugin-pages/client" />
/// <reference types="unplugin-icons/types/vue3" />

declare module '*.vue' {
   import { DefineComponent } from 'vue';
   // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
   const component: DefineComponent<{}, {}, any>;
   export default component;
}
