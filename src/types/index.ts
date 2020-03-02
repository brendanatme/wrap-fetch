export enum Methods {
  GET = 'GET',
  POST = 'POST',
}

export interface WrappedFetchApi {
  get<P>(url: string): Promise<P>;
  post<P>(url: string, body: any): Promise<P>;
}

export type FetchError = {
  status: number;
  statusText: string;
}
