import { Ref, onDeactivated, onMounted, onUnmounted, ref } from 'vue';

import { makeFetch } from '/src/helpers/makeFetch';
import { useContext } from 'vite-ssr/vue';

interface Config {
   fetchConfig: RequestInit;
   /**
    * @client_only
    * if `true` asyncData will try to block component's initialization
    * if `false` it will fetch the data onMounted hook.
    */
   awaitSetup: boolean;
   keepAlive: boolean;
   onError: (err: unknown) => any;
}
export async function useAsyncData<T>(key: string, location: string, config?: Partial<Config>) {
   const { isClient, initialState } = useContext();
   //- craete a ref via initialState[key] value or null
   const responseValue = ref(initialState[key] || null) as Ref<T | null>;

   const request = () => makeFetch<T>(location, { ...config?.fetchConfig });
   //- request handler function
   const handler = async () => {
      try {
         const [data, isError, response] = await request();
         if (isError) throw { response, data };

         responseValue.value = data;
         if (import.meta.env.SSR) initialState[key] = data;
      } catch (error) {
         config?.onError?.(error);
      }
   };

   // remove data from initialState when component unmounts or deactivates
   if (!config?.keepAlive) {
      const removeState = () => delete initialState[key];
      if (!import.meta.env.SSR) {
         onUnmounted(removeState);
         onDeactivated(removeState);
      }
   }

   //- is this function running on server side
   if (import.meta.env.SSR) {
      await handler();
      return responseValue;
   }

   //- if initialState[key] already exists mutate responseValue.value
   if (initialState[key]) {
      responseValue.value = initialState[key];
      return responseValue;
   }
   //- if inital state value does not exist fetch the data in onMounted hook or block setup.
   if (!config?.awaitSetup) onMounted(handler);
   else await handler();

   return responseValue;
}
