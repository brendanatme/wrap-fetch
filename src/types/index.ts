/**
 * HTTP verbs that Fetch will use
 */
export enum Methods {
  DELETE = 'DELETE',
  GET = 'GET',
  PATCH = 'PATCH',
  POST = 'POST',
  PUT = 'PUT',
}

/**
 * define the Wrapped Fetch API for easy use
 */
export interface WrappedFetchApi {
  configure(options: any): void;
  del<P>(url: string, options?: any): Promise<P>;
  get<P>(url: string, options?: any): Promise<P>;
  intercept(interceptor: ConfigModifierFn): void;
  patch<P>(url: string, body: any, options?: any): Promise<P>;
  post<P>(url: string, body: any, options?: any): Promise<P>;
  put<P>(url: string, body: any, options?: any): Promise<P>;
  transform(transformer: DataTransformerFn): void;
}

/**
 * HookFns can be used to see the WrappedFetch's state before and after fetch calls.
 * useful for debugging
 */
export type HookFn = (method?: Methods, requestUrl?: string, requestConfig?: any, response?: any) => void;

/**
 * allow user to modify config dynamic before requests
 * (useful for hooking to redux store.getState(), etc.)
 */
export type ConfigModifierFn = (config: any) => any;

/**
 * allow user to transform data before consuming it
 */
export type DataTransformerFn = (data: any) => any;
