import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from 'src/app/shared/services/api.service';
import { ApiPaths } from 'src/app/shared/enums/api-paths';
import { CustomResponse } from 'src/app/shared/models/response.model';
import { Customer } from '../models/customer.model';

@Injectable()
export class CustomerService {
  constructor(private apiService: ApiService) {}

  public getCustomers(
    params = {}
  ): Observable<CustomResponse<Array<Customer>>> {
    return this.apiService
      .httpGet(ApiPaths.Customers, params)
      .pipe(
        map(
          (response: any) =>
            new CustomResponse(response, (data) => this.mapCustomers(data))
        )
      );
  }

  public createCustomer(customerPayload: Customer): Observable<Customer> {
    return this.apiService
      .httpPost(ApiPaths.Customers, customerPayload)
      .pipe(map((response: any) => new Customer(response.payload)));
  }

  public updateCustomer(customer: Customer) {
    return this.apiService
      .httpPut(`${ApiPaths.Customers}/${customer.id}`, customer)
      .pipe(map((response: any) => new Customer(response.payload)));
  }

  public deleteCustomer(customerId: number): Observable<any> {
    const apiUrl = `${ApiPaths.Customers}/${customerId}`;
    return this.apiService.httpDelete(apiUrl);
  }

  public searchCustomers(params = {}): Observable<Array<Customer>> {
    return this.apiService
      .httpGet(`${ApiPaths.Customers}/search`, params)
      .pipe(map((response) => this.mapCustomers(response?.payload)));
  }

  private mapCustomers(data: any): Array<Customer> {
    return data?.map((customer: any) => new Customer(customer));
  }
}
