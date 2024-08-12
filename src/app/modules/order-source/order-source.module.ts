import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderSourceListComponent } from './components/order-source-list/order-source-list.component';
import { CreateOrderSourceComponent } from './components/create-order-source/create-order-source.component';
import { OrderSourceService } from './services/order-source.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { TableModule } from 'primeng/table';
import { OrderSourceRoutingModule } from './order-source-routing.module';
import { ButtonModule } from 'primeng/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BlockUIModule } from 'primeng/blockui';
import { ToastModule } from 'primeng/toast';
import { PaginatorModule } from 'primeng/paginator';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageService } from 'primeng/api';
import { EditOrderSourceComponent } from './components/edit-order-source/edit-order-source.component';

@NgModule({
  declarations: [
    OrderSourceListComponent,
    CreateOrderSourceComponent,
    EditOrderSourceComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    TableModule,
    OrderSourceRoutingModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    ProgressSpinnerModule,
    BlockUIModule,
    ToastModule,
    PaginatorModule,
    SkeletonModule,
  ],
  providers: [OrderSourceService, MessageService],
})
export class OrderSourceModule {}
