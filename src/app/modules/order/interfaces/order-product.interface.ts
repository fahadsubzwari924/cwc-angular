import { FormArray, FormGroup } from '@angular/forms';
import { ProductOrderProduct } from '../types/order-product.type';

/** One entry in the order products map: product + its form group and row groups for template iteration. */
export interface OrderProductMapEntry {
  product: ProductOrderProduct;
  formGroup: FormGroup;
  rows: FormArray;
  rowGroups: FormGroup[];
}

export interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

export interface AutoCompleteSelectEvent {
  originalEvent: Event;
  value: any;
}

export interface AutoCompleteUnselectEvent {
  originalEvent: Event;
  value: any;
}

export interface TabCloseEvent {
  index: number;
  originalEvent: PointerEvent;
}

export interface OrderProductRecordTuple {
  productId: number;
  color?: string;
  customizeName?: string;
  name: string;
  cost: number;
  weight: string;
  quantity: number;
}
