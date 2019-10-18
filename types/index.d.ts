export interface WrappedFetchApi {
  get: (endpoint: string) => any;
  post: (endpoint: string, body: any) => any;
}

export type WrapFetch = (
  fetchLib: any,
  baseUrl: string,
  defaultOptions: any,
  beforeHook: (method: string, url: string) => void,
) => WrappedFetchApi;
