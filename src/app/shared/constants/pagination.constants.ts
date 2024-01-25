import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PaginationConstants {
  FIRST_ROW = 0;
  CURRENT_PAGE = 1;
  readonly PAGE_LIMIT = 10;
  readonly PRODUCT_LIST_PAGE_LIMIT = 12;
}
