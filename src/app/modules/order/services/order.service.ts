import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from 'src/app/shared/services/api.service';
import { ApiPaths } from 'src/app/shared/enums/api-paths';
import { CustomResponse } from 'src/app/shared/models/response.model';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly apiService = inject(ApiService);

  public getOrders(params = {}): Observable<CustomResponse<Array<Order>>> {
    return this.apiService.httpGet(ApiPaths.Orders, params).pipe(
      map((response: any) => {
        const payload = response?.data ?? response?.payload;
        return new CustomResponse(
          { ...response, payload },
          (data) => this.mapOrders(data ?? [])
        );
      })
    );
  }

  public createOrder(orderPayload: any): Observable<Order> {
    return this.apiService.httpPost(ApiPaths.Orders, orderPayload).pipe(
      map((response: any) => {
        const payload = response?.data ?? response?.payload;
        return new Order(payload);
      })
    );
  }

  public updateOrder(orderid: number, orderPayload: any) {
    return this.apiService
      .httpPut(`${ApiPaths.Orders}/${orderid}`, orderPayload)
      .pipe(
        map((response: any) => {
          const payload = response?.data ?? response?.payload;
          return new Order(payload);
        })
      );
  }

  public getOrderById(orderId: number): Observable<Order> {
    const apiUrl = `${ApiPaths.Orders}/${orderId}`;
    return this.apiService.httpGet(apiUrl).pipe(
      map((response: any) => {
        const payload = response?.data ?? response?.payload;
        return new Order(payload);
      })
    );
  }

  public deleteOrder(OrderId: number): Observable<any> {
    const apiUrl = `${ApiPaths.Orders}/${OrderId}`;
    return this.apiService.httpDelete(apiUrl);
  }

  private mapOrders(data: any): Array<Order> {
    return (data ?? []).map((order: any) => new Order(order));
  }
}
