export enum Methods {
  DELETE = 'DELETE',
  GET = 'GET',
  PATCH = 'PATCH',
  POST = 'POST',
}

export interface WrappedFetchApi {
  del<P>(url: string, options?: any): Promise<P>;
  get<P>(url: string, options?: any): Promise<P>;
  patch<P>(url: string, body: any, options?: any): Promise<P>;
  post<P>(url: string, body: any, options?: any): Promise<P>;
}

export type FetchError = {
  status: number;
  statusText: string;
}
