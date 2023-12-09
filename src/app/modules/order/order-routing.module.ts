import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CreateOrderComponent } from './components/create-order/create-order.component';
import { OrderListComponent } from './components/order-list/order-list.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: OrderListComponent },
      { path: 'create', component: CreateOrderComponent },
    ]),
  ],
  exports: [RouterModule],
})
export class OrdersRoutingModule {}
