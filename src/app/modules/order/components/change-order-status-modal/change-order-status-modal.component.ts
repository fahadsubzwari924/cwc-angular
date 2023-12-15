import { Component, OnInit } from '@angular/core';
import { SimpleModalComponent } from 'ngx-simple-modal';
import { ProgressSpinner } from 'primeng/progressspinner';
import { OrderStatus } from '../../enums/order-setatus.enum';
import { INameValue } from 'src/app/shared/interfaces/name-value.interface';
import { OrderService } from '../../services/order.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-change-order-status-modal',
  templateUrl: './change-order-status-modal.component.html',
  styleUrls: ['./change-order-status-modal.component.scss'],
})
export class ChangeOrderStatusModalComponent
  extends SimpleModalComponent<null, boolean>
  implements OnInit
{
  title!: string;
  orderStatus!: string;
  orderId!: number;

  selectedStatus: INameValue | undefined;
  spinner: ProgressSpinner;
  orderStatusOptions: Array<INameValue> = [];
  showSpinner = false;

  constructor(
    private orderService: OrderService,
    private messageService: MessageService
  ) {
    super();
    this.spinner = new ProgressSpinner();
  }

  ngOnInit() {
    this.buildOrderStatusOptions();
    this.setOrderStatus();
  }

  changeOrderStatus(): void {
    this.showSpinner = true;
    const updateOrderPayload = {
      status: this.selectedStatus?.value,
    };
    if (this.orderId) {
      this.orderService
        .updateCustomer(this.orderId, updateOrderPayload)
        .subscribe((res) => {
          this.showSpinner = false;
          this.messageService.add({
            severity: 'success',
            detail: 'Order status changed!',
          });
          this.closeModal();
        });
    }
  }

  closeModal() {
    this.showSpinner = false;
    this.result = true;
    this.close();
  }

  private buildOrderStatusOptions(): void {
    this.orderStatusOptions = [
      {
        name: 'Pending',
        value: OrderStatus.PENDING,
      },
      {
        name: 'Placed To Vendor',
        value: OrderStatus.VENDOR,
      },
      {
        name: 'Delivered',
        value: OrderStatus.DELIVERED,
      },
      {
        name: 'Dispatched',
        value: OrderStatus.DISPATCHED,
      },
      {
        name: 'Returned',
        value: OrderStatus.RETURNED,
      },
    ];
  }

  private setOrderStatus(): void {
    this.selectedStatus = this.orderStatusOptions.find(
      (statusOption: INameValue) => statusOption.value === this.orderStatus
    );
  }
}
