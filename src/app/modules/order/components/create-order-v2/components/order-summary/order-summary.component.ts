import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';

import { OrderProductMapEntry } from '../../../../interfaces/order-product.interface';

@Component({
  selector: 'app-order-summary',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe, ButtonModule],
  templateUrl: './order-summary.component.html',
  styleUrl: './order-summary.component.scss',
})
export class OrderSummaryComponent {
  orderItems = input<OrderProductMapEntry[]>([]);
  grandTotal = input<number>(0);
  isFormInvalid = input<boolean>(true);

  save = output<void>();
  cancel = output<void>();

  getLineTotal(item: OrderProductMapEntry): number {
    const price = item.formGroup?.get('price')?.value ?? 0;
    return price * item.rowGroups.length;
  }
}
