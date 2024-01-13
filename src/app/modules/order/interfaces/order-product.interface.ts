export interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

export interface TabCloseEvent {
  index: number;
  originalEvent: PointerEvent;
}

export interface OrderProductRecordTuple {
  id: number;
  color?: string;
  customizeName?: string;
  name: string;
  cost: number;
  weight: string;
  quantity: number;
}
