import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from 'src/app/shared/services/api.service';
import { Product } from '../models/product.model';
import { ApiPaths } from 'src/app/shared/enums/api-paths';
import { CustomResponse } from 'src/app/shared/models/response.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private apiService: ApiService) {}

  public getProducts(params = {}): Observable<CustomResponse<Product[]>> {
    return this.apiService
      .httpGet(ApiPaths.Products, params)
      .pipe(
        map(
          (response: any) =>
            new CustomResponse(response, (data) => this.mapProducts(data))
        )
      );
  }

  public createProduct(productPayload: FormData): Observable<Product> {
    return this.apiService
      .httpPost(ApiPaths.Products, productPayload, true)
      .pipe(map((response: any) => new Product(response.payload)));
  }

  public updateProduct(productId: number, product: FormData) {
    return this.apiService
      .httpPut(`${ApiPaths.Products}/${productId}`, product, true)
      .pipe(map((response: any) => new Product(response.payload)));
  }

  public deleteProduct(productId: number): Observable<any> {
    const apiUrl = `${ApiPaths.Products}/${productId}`;
    return this.apiService.httpDelete(apiUrl);
  }

  public searchProducts(params = {}): Observable<Array<Product>> {
    return this.apiService
      .httpGet(`${ApiPaths.Products}/search`, params)
      .pipe(map((response) => this.mapProducts(response?.payload)));
  }

  private mapProducts(data: any): Product[] {
    return data?.map((product: any) => new Product(product));
  }
}
