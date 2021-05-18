/**
 * wrap-fetch
 * 
 * functional command to wrap a Fetch implementation
 * and provide a simple API interface
 * 
 * serves as a lighter-weight replacement of libraries like Axios,
 * and also reduces boilerplate code
 */
import { ConfigModifierFn, DataTransformerFn, HookFn, Methods, WrappedFetchApi } from './types';

const POST_HEADERS = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
};

export const wrapFetch = (
  fetchImplementation: any,
  baseUrl: string,
  defaultOptions: any = {},
  beforeHook: HookFn = () => { },
  afterHook: HookFn = () => { },
): WrappedFetchApi => {
  const interceptors: ConfigModifierFn[] = [];
  const transformers: DataTransformerFn[] = [];
  
  let config = {
    ...defaultOptions,
  };

  const _fetch = async (method: Methods, url: string, options: any = {}) => {
    const requestUrl = `${baseUrl}${url}`;
    const requestConfig = interceptors.reduce((result, next) => next(result), {
      ...config,
      ...options,
      headers: {
        ...config.headers,
        ...options.headers,
      },
      method,
    });

    beforeHook(method, requestUrl, requestConfig);

    const response: any = await fetchImplementation(requestUrl, requestConfig);

    afterHook(method, requestUrl, requestConfig, response);

    if (!response.ok) {
      throw new Error(JSON.stringify({
        status: response.status,
        statusText: response.statusText,
      }));
    }

    const data = response.status !== 204 ? response.json() : response;

    return transformers.reduce((result, next) => next(result), data);
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
        headers: {
          ...config.headers,
          ...options.headers,
        },
      };
    },

    del: makeGetFn(Methods.DELETE),

    get: makeGetFn(Methods.GET),

    intercept(interceptor: ConfigModifierFn): void {
      interceptors.push(interceptor);
    },

    patch: makePostFn(Methods.PATCH),

    post: makePostFn(Methods.POST),

    put: makePostFn(Methods.PUT),

    transform(transformer: DataTransformerFn): void {
      transformers.push(transformer);
    }
  };
};
