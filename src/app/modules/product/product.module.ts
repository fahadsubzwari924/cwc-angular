import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './components/list/list.component';
import { CreateComponent } from './components/create/create.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CustomPrimengModule } from '../primeng/primeng.module';
import { ProductService } from './services/product-api.service';
import { ProductsRoutingModule } from './product-routing.module';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BlockUIModule } from 'primeng/blockui';

@NgModule({
  declarations: [ListComponent, CreateComponent],
  imports: [
    CommonModule,
    SharedModule,
    CustomPrimengModule,
    ProductsRoutingModule,
    InputTextareaModule,
    FormsModule,
    ReactiveFormsModule,
    ProgressSpinnerModule,
    BlockUIModule,
  ],
  providers: [ProductService],
})
export class ProductModule {}
