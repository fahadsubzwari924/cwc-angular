import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { Divider } from 'primeng/divider';
import { Tooltip } from 'primeng/tooltip';

import { OrderProductMapEntry } from '../../../../interfaces/order-product.interface';
import { ProductOrderProduct } from '../../../../types/order-product.type';

@Component({
  selector: 'app-product-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    DecimalPipe,
    ButtonModule,
    InputNumberModule,
    FloatLabel,
    InputText,
    Divider,
    Tooltip,
  ],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  item = input.required<OrderProductMapEntry>();

  removeProduct = output<ProductOrderProduct>();
  removeRow = output<number>();
  addRow = output<void>();
  priceBlur = output<void>();

  getLineTotal(entry: OrderProductMapEntry): number {
    const price = entry.formGroup?.get('price')?.value ?? 0;
    return price * entry.rowGroups.length;
  }
}
