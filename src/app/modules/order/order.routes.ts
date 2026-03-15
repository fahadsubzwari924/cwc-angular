import { Routes } from '@angular/router';
import { CreateOrderComponent } from './components/create-order/create-order.component';
import { CreateOrderV2Component } from './components/create-order-v2/create-order-v2.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { EditOrderComponent } from './components/edit-order/edit-order.component';

export const orderRoutes: Routes = [
  { path: '', component: OrderListComponent },
  { path: 'create', component: CreateOrderComponent },
  { path: 'create-v2', component: CreateOrderV2Component },
  { path: ':orderId/edit', component: EditOrderComponent },
];
