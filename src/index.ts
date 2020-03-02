import { FetchError, Methods, WrappedFetchApi } from './types';

const parseError = (err: Error): FetchError => {
  const s = err.toString();
  const json = s.replace('Error: ', '');
  const parsed = JSON.parse(json);
  return parsed;
}

const wrapFetch = (
  f: any,
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
        throw new Error(JSON.stringify({
          status: response.status,
          statusText: response.statusText,
        }));
      }
      return response;
    }).then((response: any) => response.json());
  };

  return {
    get<P>(url: string, options: any = {}): Promise<P> { return _fetch(Methods.GET, url, options); },
    post<P>(url: string, data: any, options: any = {}): Promise<P> {
      return _fetch(Methods.POST, url, {
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
        ...options
      });
    },
  };
};

export {
  parseError,
  wrapFetch,
  WrappedFetchApi,
}
