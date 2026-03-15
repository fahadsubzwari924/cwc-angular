import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ModalService } from 'src/app/shared/services/modal.service';
import { MessageService } from 'primeng/api';
import { of, switchMap, tap } from 'rxjs';
import { BlockUIModule } from 'primeng/blockui';
import { ToastModule } from 'primeng/toast';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TabViewModule } from 'primeng/tabview';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ChipModule } from 'primeng/chip';
import { DatePickerModule } from 'primeng/datepicker';
import { SkeletonModule } from 'primeng/skeleton';
import { MultiSelectModule } from 'primeng/multiselect';
import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { ConfirmationModalComponent } from 'src/app/shared/components/confirmation-modal/confirmation-modal.component';
import { PaginationConstants } from 'src/app/shared/constants/pagination.constants';
import { CustomResponse } from 'src/app/shared/models/response.model';
import { Order } from '../../models/order.model';
import { OrderService } from '../../services/order.service';
import { OrderStatus } from '../../enums/order-setatus.enum';
import { Router } from '@angular/router';
import { UtilService } from 'src/app/util/util.service';
import { ListConstants } from 'src/app/constants/list-constants';
import { FieldPipe } from 'src/app/shared/pipes/show-nested-field.pipe';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    BlockUIModule,
    ToastModule,
    PaginatorModule,
    TableModule,
    ButtonModule,
    AutoCompleteModule,
    TabViewModule,
    DropdownModule,
    ProgressSpinnerModule,
    ChipModule,
    DatePickerModule,
    SkeletonModule,
    MultiSelectModule,
    DatePipe,
    CurrencyPipe,
    FieldPipe,
  ],
})
export class OrderListComponent {
  orders = signal<Order[]>([]);
  orderResponseMetadata = signal<any>(null);
  isLoading = signal(false);
  isOrderStatusUpdated = signal(false);
  startingRow = signal(0);

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

  sortOrder = signal(0);
  sortField = signal('');
  orderStatusValues: { [key: string]: string } = {
    pending: 'Pending',
    vendor: 'Vendor',
    dispatched: 'Dispatched',
    returned: 'Returned',
    delivered: 'Delivered',
  };
  orderStatusOptions: Array<{ name: string; value: string }> = [
    { name: 'Pending', value: OrderStatus.PENDING },
    { name: 'Placed To Vendor', value: OrderStatus.VENDOR },
    { name: 'Dispatched', value: OrderStatus.DISPATCHED },
    { name: 'Delivered', value: OrderStatus.DELIVERED },
    { name: 'Returned', value: OrderStatus.RETURNED },
  ];
  statusUpdateInProgress = signal<Record<number, boolean>>({});
  chipsValues = ['Customize With Class', 'Shopify Store'];

  private readonly orderService = inject(OrderService);
  readonly paginationConstants = inject(PaginationConstants);
  private readonly modalService = inject(ModalService);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);
  private readonly utilService = inject(UtilService);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.startingRow.set(this.paginationConstants.FIRST_ROW);
    this.getOrders();
  }

  getOrders(params: any = {}): void {
    this.isLoading.set(true);
    this.orderService
      .getOrders(params)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: CustomResponse<Order[]>) => {
          this.orders.set(response?.payload ?? []);
          this.orderResponseMetadata.set(response.metadata);
          if (this.isOrderStatusUpdated()) {
            this.setCurrentPage();
          }
        },
        error: (error) => {
          console.log(error);
          this.isLoading.set(false);
          this.orders.set([]);
        },
        complete: () => {
          this.isLoading.set(false);
        },
      });
  }

  onDelete(order: Order): void {
    const description = `Are you sure you want to delete this order with order ID:  "${order.id}" and customer name: ${order?.customer?.fullName}?`;
    const toastMessage = 'Order deleted!';
    this.modalService
      .open(ConfirmationModalComponent, {
        modalTitle: 'Delete Order',
        modalDescription: description,
      }, { header: 'Delete Order' })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((isConfirmed) => {
        if (isConfirmed) {
          this.orderService
            .deleteOrder(order.id as number)
            .pipe(
              tap(() => this.showToast(toastMessage)),
              tap(() => this.setCurrentPage()),
              switchMap(() => of(this.getOrders())),
              takeUntilDestroyed(this.destroyRef)
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
    this.startingRow.set(paginationEvent?.first ?? 0);
    this.utilService.setValueInLocalStorage(
      ListConstants.CURRENT_ROWS,
      this.startingRow()
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

  getSelectedStatusOption(order: Order): { name: string; value: string } | null {
    const status = order?.status?.toLowerCase();
    return this.orderStatusOptions.find((o) => o.value === status) ?? null;
  }

  onStatusChange(order: Order, event: { value: { name: string; value: string } }): void {
    const newStatus = event?.value;
    if (!newStatus || !order?.id) return;
    this.statusUpdateInProgress.update((m) => ({ ...m, [order.id as number]: true }));
    this.orderService
      .updateOrder(order.id as number, { status: newStatus.value })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(() => {
          this.statusUpdateInProgress.update((m) => ({ ...m, [order.id as number]: false }));
          this.showToast('Order status updated');
          this.isOrderStatusUpdated.set(true);
          const requestParams = {
            page:
              this.utilService.getFromLocalStorage(ListConstants.CURRENT_PAGE) ??
              this.paginationConstants.CURRENT_PAGE,
          };
          this.getOrders(requestParams);
        })
      )
      .subscribe({
        error: () => {
          this.statusUpdateInProgress.update((m) => ({ ...m, [order.id as number]: false }));
        },
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
    this.startingRow.set(
      this.utilService.getFromLocalStorage(ListConstants.CURRENT_ROWS)
    );
  }
}
