import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from 'src/app/shared/services/api.service';
import { Product } from '../models/product.model';
import { ApiPaths } from 'src/app/shared/enums/api-paths';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private apiService: ApiService) {}

  public getProducts(): Observable<Array<Product>> {
    return this.apiService
      .httpGet(ApiPaths.Products)
      .pipe(
        map((response: any) =>
          response.payload.records?.map(
            (product: Product) => new Product(product)
          )
        )
      );
  }

  public createProduct(productPayload: Product): Observable<Product> {
    return this.apiService
      .httpPost(ApiPaths.Products, productPayload)
      .pipe(map((response: any) => new Product(response.payload)));
  }

  public updateProduct(product: Product) {
    return this.apiService
    .httpPut(`${ApiPaths.Products}/${product.id}`, product)
    .pipe(map((response: any) => new Product(response.payload)));
  }
}
