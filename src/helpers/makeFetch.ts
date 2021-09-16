type FetchOptions = Parameters<typeof fetch>['1'];

const [JsonHeader, JsonValue] = ['Content-Type', 'application/json'] as const;

/**
 * Automatic Fetch Content-Type JSON header
 */
const makeFetchHeaderHandler = (options: FetchOptions) => {
   if (!options) return;
   const { body, headers } = options;
   if (!body || typeof body !== 'string') return;

   let parsedBody: any = null;
   try {
      parsedBody = JSON.parse(body);
   } catch {
      return;
   }

   if (typeof parsedBody === 'object') {
      if (headers instanceof Headers) {
         headers.set(JsonHeader, JsonValue);
         return;
      }
      if (Array.isArray(headers)) {
         options.headers = [...headers, [JsonHeader, JsonValue]];
         return;
      }
      options.headers = { ...headers, [JsonHeader]: JsonValue };
   }
};

/**
 * Wrapper function for Fetch with type support and try-catch support on bad request.
 * @returns [`data`, `isError`, `response`]
 */
export async function makeFetch<T>(url: string, options?: FetchOptions): Promise<[T, boolean, Response]> {
   makeFetchHeaderHandler(options);

   const response = await fetch(url, options);
   let isError = false;
   if (!response.ok) isError = true;
   const data: T = await response.json();
   return [data, isError, response];
}
