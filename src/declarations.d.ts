import { IncomingMessage, ServerResponse } from 'http';

declare module 'vite-ssr/vue' {
   export interface Context {
      initialState: {
         pinia: any;
         [key: string]: any;
      };
      request: IncomingMessage;
      response: ServerResponse;
   }
}
