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

  /**
   * the base function we'll use to make all fetch calls. it:
   * - merges the configs (1st priority: function arg; 2nd priority: api config)
   * - runs interceptors to modify config at request time
   * - calls 'beforeHook'
   * - runs fetch
   * - calls 'afterHook'
   * - cleans up data
   * - runs transformers on data and return data
   */
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

    const data = response.status !== 204 ? await response.json() : response;

    return transformers.reduce((result, next) => next(result), data);
  };

  /**
   * a higher-order function we can use to create publicly-exposed api methods
   * if its a simple request with no payload arguments, like a GET or DELETE,
   * use this
   */
  const makeGetFn = (method: Methods) => <P>(url: string, options: any = {}): Promise<P> => _fetch(method, url, options);

  /**
   * a higher-order fucntion we can use to create publicly-exposed api methods
   * for requests that need payload arguments, like POST, PUT, and PATCH,
   * use this
   */
  const makePostFn = (method: Methods) => async <P>(url: string, data: any, options: any = {}): Promise<P> => {
    const { headers, ...remainder } = options

    const results = await _fetch(method, url, {
      body: JSON.stringify(data),
      headers: {
        ...POST_HEADERS,
        ...headers,
      },
      ...remainder,
    });

    return results;
  };

  /**
   * expose the public methods of our returned api object
   * 
   * 5 api methods:
   * 
   * - del(url)
   * - get(url)
   * - patch(url, body)
   * - post(url, body)
   * - put(url, body)
   * 
   * and 3 configuration methods:
   * 
   * - configure(config) update the config
   * - intercept(fn) add a function to modify the config at request-time
   * - transform(fn) add a function to modify the data output at request-time
   */
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
