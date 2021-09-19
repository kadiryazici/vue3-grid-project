import Icons from 'unplugin-icons/vite';
// import Legacy from '@vitejs/plugin-legacy';
import Pages from 'vite-plugin-pages';
import SSR from 'vite-ssr/plugin';
import Vue from '@vitejs/plugin-vue';
import VueJSX from '@vitejs/plugin-vue-jsx';
import WindiCSS from 'vite-plugin-windicss';
import { defineConfig } from 'vite';
import path from 'node:path';

const isBuildSSR = !!process.env.SSR_BUILD;
const root = process.cwd();

// https://vitejs.dev/config/
export default defineConfig({
   plugins: [
      Vue(),
      VueJSX(),
      WindiCSS(),
      SSR(),
      // Legacy(),
      Pages({ pagesDir: 'src/pages' }),
      Icons({ compiler: 'vue3' })
   ],
   css: {
      preprocessorOptions: {
         scss: {
            additionalData: `
               @use "/src/styles/colors.scss" as colors;
               @use "/src/styles/vars.scss" as vars;
               @use "/src/styles/mixins.scss" as *;
               @use "/src/styles/functions.scss" as *;
            `
         }
      }
   },
   resolve: {
      alias: {
         $helpers: GetPath('src', 'helpers'),
         $api: GetPath('src', 'api'),
         $types: GetPath('src', 'types.ts')
      }
   },
   build: {
      outDir: isBuildSSR ? 'dist-ssr' : 'dist'
   }
});

function GetPath(...paths: string[]) {
   return path.resolve(root, ...paths);
}
