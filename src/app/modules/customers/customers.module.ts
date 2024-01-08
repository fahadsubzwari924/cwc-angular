import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerListComponent } from './components/customer-list/customer-list.component';
import { CustomerService } from './services/customer.service';
import { TableModule } from 'primeng/table';
import { CustomerRoutingModule } from './customer-routing.module';
import { ButtonModule } from 'primeng/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BlockUIModule } from 'primeng/blockui';
import { ToastModule } from 'primeng/toast';
import { PaginatorModule } from 'primeng/paginator';
import { SharedModule } from 'src/app/shared/shared.module';
import { CreateCustomerComponent } from './components/create-customer/create-customer.component';
import { MessageService } from 'primeng/api';
import { EditCustomerComponent } from './components/edit-customer/edit-customer.component';

@NgModule({
  declarations: [
    CustomerListComponent,
    CreateCustomerComponent,
    EditCustomerComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    TableModule,
    CustomerRoutingModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    ProgressSpinnerModule,
    BlockUIModule,
    ToastModule,
    PaginatorModule,
  ],
  providers: [CustomerService, MessageService],
})
export class CustomersModule {}
