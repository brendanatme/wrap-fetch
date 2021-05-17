/**
 * wrap-fetch has a utility fn that converts an API error string into an object
 */
export type FetchError = {
  status: number;
  statusText: string;
};

export const parseError = (err: Error): FetchError => {
  const s = err.toString();
  const json = s.replace('Error: ', '');
  const parsed = JSON.parse(json);
  return parsed;
};
