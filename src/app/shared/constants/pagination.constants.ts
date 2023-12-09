import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PaginationConstants {
  readonly FIRST_ROW = 0;
  readonly PAGE_LIMIT = 10;
}
