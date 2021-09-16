import { acceptHMRUpdate, defineStore } from 'pinia';

import { useDark } from '@vueuse/core';

export const useMainStore = defineStore('AppMainStore', {
   state: () => ({
      isDarkMode: useDark()
   }),
   actions: {
      toggleDark() {
         this.isDarkMode = !this.isDarkMode;
      }
   }
});

// for vite development
if (import.meta.hot) acceptHMRUpdate(useMainStore, import.meta.hot);
