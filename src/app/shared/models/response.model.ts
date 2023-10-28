export class CustomResponse<T> {
  payload: T;
  metadata: any;
  error: string;

  constructor(response: any, mapper: (data: any) => T) {
    this.payload = mapper(response?.payload);
    this.metadata = response?.metadata || {};
    this.error = response?.error ?? '';
  }
}
