import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from 'src/app/shared/services/api.service';
import { ApiPaths } from 'src/app/shared/enums/api-paths';
import { CustomResponse } from 'src/app/shared/models/response.model';
import { OrderSource } from '../models/order-source.model';

@Injectable()
export class OrderSourceService {
  constructor(private apiService: ApiService) {}

  public getOrderSources(
    params = {}
  ): Observable<CustomResponse<Array<OrderSource>>> {
    return this.apiService
      .httpGet(ApiPaths.OrderSources, params)
      .pipe(
        map(
          (response: any) =>
            new CustomResponse(response, (data) => this.mapOrderSources(data))
        )
      );
  }

  public createOrderSource(
    orderSourcePayload: OrderSource
  ): Observable<OrderSource> {
    return this.apiService
      .httpPost(ApiPaths.OrderSources, orderSourcePayload)
      .pipe(map((response: any) => new OrderSource(response.payload)));
  }

  public updateOrderSource(orderSource: OrderSource) {
    return this.apiService
      .httpPut(`${ApiPaths.OrderSources}/${orderSource?.id}`, orderSource)
      .pipe(map((response: any) => new OrderSource(response.payload)));
  }

  public deleteOrderSourceById(orderSourceId: number): Observable<any> {
    const apiUrl = `${ApiPaths.OrderSources}/${orderSourceId}`;
    return this.apiService.httpDelete(apiUrl);
  }

  private mapOrderSources(data: any): Array<OrderSource> {
    return data?.map((orderSource: any) => new OrderSource(orderSource));
  }
}
