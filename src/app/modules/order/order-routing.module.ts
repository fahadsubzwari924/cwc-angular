import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CreateOrderComponent } from './components/create-order/create-order.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { EditOrderComponent } from './components/edit-order/edit-order.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: OrderListComponent },
      { path: 'create', component: CreateOrderComponent },
      { path: ':orderId/edit', component: EditOrderComponent },
    ]),
  ],
  exports: [RouterModule],
})
export class OrdersRoutingModule {}
