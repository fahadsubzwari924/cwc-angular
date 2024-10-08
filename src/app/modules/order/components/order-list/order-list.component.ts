import { Component } from '@angular/core';
import { SimpleModalService } from 'ngx-simple-modal';
import { MessageService } from 'primeng/api';
import { of, switchMap, tap } from 'rxjs';
import { ConfirmationModalComponent } from 'src/app/shared/components/confirmation-modal/confirmation-modal.component';
import { PaginationConstants } from 'src/app/shared/constants/pagination.constants';
import { CustomResponse } from 'src/app/shared/models/response.model';
import { Order } from '../../models/order.model';
import { OrderService } from '../../services/order.service';
import { ChangeOrderStatusModalComponent } from '../change-order-status-modal/change-order-status-modal.component';
import { Router } from '@angular/router';
import { UtilService } from 'src/app/util/util.service';
import { ListConstants } from 'src/app/constants/list-constants';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
})
export class OrderListComponent {
  constructor(
    private orderService: OrderService,
    public paginationConstants: PaginationConstants,
    private modalService: SimpleModalService,
    private messageService: MessageService,
    private router: Router,
    private utilService: UtilService
  ) {}

  orders: Array<Order> = [];
  orderResponseMetadata: any;
  columns = [
    {
      field: 'id',
      header: 'Order ID',
      type: 'string',
    },
    {
      field: 'customer.fullName',
      header: 'Customer',
      type: 'string',
    },
    {
      field: 'amount',
      header: 'Total Amount',
      type: 'currency',
    },
    {
      field: 'description',
      header: 'Description',
      type: 'string',
    },
    {
      field: 'status',
      header: 'Status',
      type: 'chips',
    },
    {
      field: 'orderDate',
      header: 'Date',
      type: 'date',
    },
  ];
  sortOrder: number = 0;
  sortField: string = '';
  orderStatusValues: { [key: string]: string } = {
    pending: 'Pending',
    vendor: 'Vendor',
    dispatched: 'Dispatched',
    returned: 'Returned',
    delivered: 'Delivered',
  };
  isLoading: boolean = false;
  startingRow = 0;
  isOrderStatusUpdated = false;
  chipsValues = ['Customize With Class', 'Shopify Store'];

  ngOnInit(): void {
    this.startingRow = this.paginationConstants.FIRST_ROW;
    this.getOrders();
  }

  getOrders(params: any = {}): void {
    this.isLoading = true;
    this.orderService.getOrders(params).subscribe({
      next: (response: CustomResponse<Order[]>) => {
        this.orders = response?.payload ?? [];
        this.orderResponseMetadata = response.metadata;
        if (this.isOrderStatusUpdated) {
          this.setCurrentPage();
        }
      },
      error: (error) => {
        console.log(error);
        this.isLoading = false;
        this.orders = [];
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  onDelete(order: Order): void {
    const description = `Are you sure you want to delete this order with order ID:  "${order.id}" and customer name: ${order?.customer?.fullName}?`;
    const toastMessage = 'Order deleted!';
    this.modalService
      .addModal(ConfirmationModalComponent, {
        modalTitle: 'Delete Order',
        modalDescription: description,
      })
      .subscribe((isConfirmed) => {
        if (isConfirmed) {
          this.orderService
            .deleteOrder(order.id as number)
            .pipe(
              tap(() => this.showToast(toastMessage)),
              tap(() => this.setCurrentPage()),
              switchMap(() => of(this.getOrders()))
            )
            .subscribe();
        }
      });
  }

  showToast(message: string) {
    this.messageService.add({
      severity: 'success',
      detail: message,
    });
  }

  onPageChange(paginationEvent: any): void {
    this.startingRow = paginationEvent?.first ?? 0;
    this.utilService.setValueInLocalStorage(
      ListConstants.CURRENT_ROWS,
      this.startingRow
    );
    this.utilService.setValueInLocalStorage(
      ListConstants.CURRENT_PAGE,
      paginationEvent?.page + 1
    );
    const queryParams = {
      page: paginationEvent?.page + 1,
    };
    this.getOrders(queryParams);
  }

  onChangeOrderStatus(order: Order): void {
    const inputs = {
      title: 'Change Order Status',
      orderStatus: order.status?.toLowerCase(),
      orderId: order.id,
    };
    this.modalService
      .addModal(ChangeOrderStatusModalComponent, inputs)
      .subscribe((isConfirmed) => {
        if (isConfirmed) {
          this.isOrderStatusUpdated = true;
          const requestParams = {
            page:
              this.utilService.getFromLocalStorage(
                ListConstants.CURRENT_PAGE
              ) ?? this.paginationConstants.CURRENT_PAGE,
          };
          this.getOrders(requestParams);
        }
      });
  }

  onEdit(orderId: number) {
    if (orderId) {
      this.router.navigate([`orders/${orderId}/edit`]);
    } else {
      this.messageService.add({
        severity: 'warning',
        detail: 'Order id not found',
      });
    }
  }

  private setCurrentPage(): void {
    this.startingRow = this.utilService.getFromLocalStorage(
      ListConstants.CURRENT_ROWS
    );
  }
}
