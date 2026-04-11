import { Routes } from '@angular/router';
import { CreateOrderV2Component } from './components/create-order-v2/create-order-v2.component';
import { OrderListComponent } from './components/order-list/order-list.component';

export const orderRoutes: Routes = [
  { path: '', component: OrderListComponent },
  { path: 'create', component: CreateOrderV2Component },
  { path: ':orderId/edit', component: CreateOrderV2Component },
];
