export const wrapFetch = (
  f,
  baseUrl,
  defaults,
  beforeHook = () => {},
) => {
  const _fetch = (method, url, options = {}) => {
    beforeHook(method, url);
    return f(`${baseUrl}${url}`, {
      ...defaults,
      ...options,
      headers: {
        ...defaults.headers,
        ...options.headers,
      },
      method,
    }).then((response) => {
      if (!response.ok) {
        throw new Error(`Error in "wrapFetch": ${method} ${url} failed: ${response.status}`);
      }
      return response;
    }).then((response) => response.json());
  };

  return {
    get: (url) => _fetch('GET', url),
    post: (url, data) => _fetch('POST', url, {
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    }),
  };
};
