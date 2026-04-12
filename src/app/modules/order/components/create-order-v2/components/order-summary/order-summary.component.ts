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

  totalUnitsForProduct(item: OrderProductMapEntry): number {
    return item.rowGroups.reduce((sum, row) => {
      const q = Math.max(1, Math.floor(Number(row.get('quantity')?.value) || 1));
      return sum + q;
    }, 0);
  }

  getLineTotal(item: OrderProductMapEntry): number {
    const price = Number(item.formGroup?.get('price')?.value) || 0;
    return item.rowGroups.reduce((sum, row) => {
      const q = Math.max(1, Math.floor(Number(row.get('quantity')?.value) || 1));
      return sum + price * q;
    }, 0);
  }
}
