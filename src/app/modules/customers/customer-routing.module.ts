import { CustomerListComponent } from './components/customer-list/customer-list.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([{ path: '', component: CustomerListComponent }]),
  ],
  exports: [RouterModule],
})
export class CustomerRoutingModule {}
