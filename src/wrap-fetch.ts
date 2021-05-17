/**
 * wrap-fetch
 * 
 * functional command to wrap a Fetch implementation
 * and provide a simple API interface
 * 
 * serves as a lighter-weight replacement of libraries like Axios,
 * and also reduces boilerplate code
 */
import { HookFn, Methods, WrappedFetchApi } from './types';

const POST_HEADERS = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
};

export const wrapFetch = (
  f: any,
  baseUrl: string,
  defaultOptions: any = {},
  beforeHook: HookFn = () => { },
  afterHook: HookFn = () => { },
): WrappedFetchApi => {
  let config = {
    ...defaultOptions,
  };

  const _fetch = async (method: Methods, url: string, options: any = {}) => {
    const requestUrl = `${baseUrl}${url}`;
    const requestConfig = {
      ...config,
      ...options,
      headers: {
        ...config.headers,
        ...options.headers,
      },
      method,
    };

    beforeHook(method, requestUrl, requestConfig);

    const response: any = await f(requestUrl, requestConfig);

    afterHook(method, requestUrl, requestConfig, response);

    if (!response.ok) {
      throw new Error(JSON.stringify({
        status: response.status,
        statusText: response.statusText,
      }));
    }

    return response.status !== 204 ? response.json() : response;
  };

  const makeGetFn = (method: Methods) => <P>(url: string, options: any = {}): Promise<P> => _fetch(method, url, options);

  const makePostFn = (method: Methods) => async <P>(url: string, data: any, options: any = {}): Promise<P> => {
    const { headers, ...remainder } = options

    const results = await _fetch(method, url, {
      body: JSON.stringify(data),
      headers: {
        ...POST_HEADERS,
        ...headers,
      },
      ...remainder
    });

    return results;
  };

  return {
    configure(options: any): void {
      config = {
        ...config,
        ...options,
      };
    },

    del: makeGetFn(Methods.DELETE),

    get: makeGetFn(Methods.GET),

    patch: makePostFn(Methods.PATCH),

    post: makePostFn(Methods.POST),

    put: makePostFn(Methods.PUT),
  };
};
