import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OrderSourceListComponent } from './components/order-source-list/order-source-list.component';

@NgModule({
  imports: [
    RouterModule.forChild([{ path: '', component: OrderSourceListComponent }]),
  ],
  exports: [RouterModule],
})
export class OrderSourceRoutingModule {}
