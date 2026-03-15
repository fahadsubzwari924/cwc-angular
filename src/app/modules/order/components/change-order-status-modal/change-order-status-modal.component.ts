import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BaseDialogComponent } from 'src/app/shared/components/base-dialog/base-dialog.component';
import { OrderStatus } from '../../enums/order-setatus.enum';
import { LoadingService } from 'src/app/core/services/loading.service';
import { INameValue } from 'src/app/shared/interfaces/name-value.interface';
import { OrderService } from '../../services/order.service';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-change-order-status-modal',
  templateUrl: './change-order-status-modal.component.html',
  styleUrls: ['./change-order-status-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FormsModule, DropdownModule, ButtonModule],
})
export class ChangeOrderStatusModalComponent extends BaseDialogComponent implements OnInit {
  private readonly orderService = inject(OrderService);
  private readonly messageService = inject(MessageService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly loadingService = inject(LoadingService);

  get title(): string {
    return this.data?.['title'] ?? 'Change Order Status';
  }

  get orderStatus(): string {
    return this.data?.['orderStatus'] ?? '';
  }

  get orderId(): number {
    return this.data?.['orderId'];
  }

  selectedStatus: INameValue | undefined;
  orderStatusOptions: Array<INameValue> = [];

  ngOnInit(): void {
    this.buildOrderStatusOptions();
    this.setOrderStatus();
  }

  changeOrderStatus(): void {
    this.loadingService.show('Updating status...');
    const updateOrderPayload = {
      status: this.selectedStatus?.value,
    };
    if (this.orderId) {
      this.orderService
        .updateOrder(this.orderId, updateOrderPayload)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.loadingService.hide();
            this.messageService.add({
              severity: 'success',
              detail: 'Order status changed!',
            });
            this.closeModal();
          },
          error: () => this.loadingService.hide(),
        });
    }
  }

  closeModal(): void {
    this.loadingService.hide();
    this.close(true);
  }

  private buildOrderStatusOptions(): void {
    this.orderStatusOptions = [
      { name: 'Pending', value: OrderStatus.PENDING },
      { name: 'Placed To Vendor', value: OrderStatus.VENDOR },
      { name: 'Delivered', value: OrderStatus.DELIVERED },
      { name: 'Dispatched', value: OrderStatus.DISPATCHED },
      { name: 'Returned', value: OrderStatus.RETURNED },
    ];
  }

  private setOrderStatus(): void {
    this.selectedStatus = this.orderStatusOptions.find(
      (statusOption: INameValue) => statusOption.value === this.orderStatus
    );
  }
}
