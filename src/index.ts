import { FetchError, Methods, WrappedFetchApi } from './types';

const parseError = (err: Error): FetchError => {
  const s = err.toString();
  const json = s.replace('Error: ', '');
  const parsed = JSON.parse(json);
  return parsed;
}

const POST_HEADERS = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
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
    }).then((response: any) => response && response.json ? response.json() : response);
  };

  return {
    del<P>(url: string, options: any = {}): Promise<P> {
      return _fetch(Methods.DELETE, url, options);
    },

    get<P>(url: string, options: any = {}): Promise<P> {
      return _fetch(Methods.GET, url, options);
    },
    
    patch<P>(url: string, data: any, options: any = {}): Promise<P> {
      const { headers, ...remainder } = options
      return _fetch(Methods.PATCH, url, {
        body: JSON.stringify(data),
        headers: {
          ...POST_HEADERS,
          ...headers,
        },
        ...remainder
      });
    },
    
    post<P>(url: string, data: any, options: any = {}): Promise<P> {
      const { headers, ...remainder } = options
      return _fetch(Methods.POST, url, {
        body: JSON.stringify(data),
        headers: {
          ...POST_HEADERS,
          ...headers,
        },
        ...remainder
      });
    },
  };
};

export {
  parseError,
  wrapFetch,
  WrappedFetchApi,
}
