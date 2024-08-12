import { NgModule } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { OrderService } from './services/order.service';
import { OrderListComponent } from './components/order-list/order-list.component';
import { OrdersRoutingModule } from './order-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { BlockUIModule } from 'primeng/blockui';
import { ToastModule } from 'primeng/toast';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { CreateOrderComponent } from './components/create-order/create-order.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CustomerService } from '../customers/services/customer.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabViewModule } from 'primeng/tabview';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ChipModule } from 'primeng/chip';
import { ChangeOrderStatusModalComponent } from './components/change-order-status-modal/change-order-status-modal.component';
import { EditOrderComponent } from './components/edit-order/edit-order.component';
import { CalendarModule } from 'primeng/calendar';
import { SkeletonModule } from 'primeng/skeleton';
import { OrderSourceService } from '../order-source/services/order-source.service';

@NgModule({
  declarations: [
    OrderListComponent,
    CreateOrderComponent,
    ChangeOrderStatusModalComponent,
    EditOrderComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    OrdersRoutingModule,
    BlockUIModule,
    ToastModule,
    PaginatorModule,
    TableModule,
    ButtonModule,
    AutoCompleteModule,
    FormsModule,
    ReactiveFormsModule,
    TabViewModule,
    DropdownModule,
    ProgressSpinnerModule,
    ChipModule,
    CalendarModule,
    SkeletonModule,
  ],
  providers: [
    OrderService,
    MessageService,
    CustomerService,
    TitleCasePipe,
    OrderSourceService,
    TitleCasePipe,
  ],
})
export class OrderModule {}
