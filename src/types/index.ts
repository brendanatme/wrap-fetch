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
  patch<P>(url: string, body: any, options?: any): Promise<P>;
  post<P>(url: string, body: any, options?: any): Promise<P>;
  put<P>(url: string, body: any, options?: any): Promise<P>;
}

/**
 * HookFns can be used to see the WrappedFetch's state before and after fetch calls.
 * useful for debugging
 */
export type HookFn = (method?: Methods, requestUrl?: string, requestConfig?: any, response?: any) => void;

