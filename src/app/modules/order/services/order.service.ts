import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from 'src/app/shared/services/api.service';
import { ApiPaths } from 'src/app/shared/enums/api-paths';
import { CustomResponse } from 'src/app/shared/models/response.model';
import { Order } from '../models/order.model';

@Injectable()
export class OrderService {
  constructor(private apiService: ApiService) {}

  public getOrders(params = {}): Observable<CustomResponse<Array<Order>>> {
    return this.apiService
      .httpGet(ApiPaths.Orders, params)
      .pipe(
        map(
          (response: any) =>
            new CustomResponse(response, (data) => this.mapOrders(data))
        )
      );
  }

  public createOrder(orderPayload: any): Observable<Order> {
    return this.apiService
      .httpPost(ApiPaths.Orders, orderPayload)
      .pipe(map((response: any) => new Order(response.payload)));
  }

  public updateCustomer(orderid: number, orderPayload: any) {
    return this.apiService
      .httpPut(`${ApiPaths.Orders}/${orderid}`, orderPayload)
      .pipe(map((response: any) => new Order(response.payload)));
  }

  // public deleteCustomer(customerId: number): Observable<any> {
  //   const apiUrl = `${ApiPaths.Customers}/${customerId}`;
  //   return this.apiService.httpDelete(apiUrl);
  // }

  private mapOrders(data: any): Array<Order> {
    return data.map((order: any) => new Order(order));
  }
}