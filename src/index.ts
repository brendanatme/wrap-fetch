import { Methods, WrappedFetchApi } from './types';

const wrapFetch = (
  f: (url: string, options: any) => any,
  baseUrl: string,
  defaultOptions: any = {},
  beforeHook: (method: Methods, url: string) => void = () => {},
): WrappedFetchApi => {
  const _fetch = (method: Methods, url: string, options: any = {}) => {
    beforeHook(method, url);
    return f(`${baseUrl}${url}`, {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
      method,
    }).then((response: any) => {
      if (!response.ok) {
        throw new Error(`Error in "wrapFetch": ${method} ${url} failed: ${response.status}`);
      }
      return response;
    }).then((response: any) => response.json());
  };

  return {
    get<P>(url: string): Promise<P> { return _fetch(Methods.GET, url); },
    post<P>(url: string, data: any): Promise<P> {
      return _fetch(Methods.POST, url, {
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      });
    },
  };
};

export {
  wrapFetch,
  WrappedFetchApi,
}
