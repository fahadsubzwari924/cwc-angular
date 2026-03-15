import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalService } from 'src/app/shared/services/modal.service';
import { MessageService } from 'primeng/api';
import { PaginationConstants } from 'src/app/shared/constants/pagination.constants';
import { UtilService } from 'src/app/util/util.service';
import { OrderSourceService } from '../../services/order-source.service';
import { CustomResponse } from 'src/app/shared/models/response.model';
import { OrderSource } from '../../models/order-source.model';
import { ListConstants } from 'src/app/constants/list-constants';
import { CreateOrderSourceComponent } from '../create-order-source/create-order-source.component';
import { ConfirmationModalComponent } from 'src/app/shared/components/confirmation-modal/confirmation-modal.component';
import { of, switchMap, tap } from 'rxjs';
import { EditOrderSourceComponent } from '../edit-order-source/edit-order-source.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { PaginatorModule } from 'primeng/paginator';
import { BlockUIModule } from 'primeng/blockui';
import { SkeletonModule } from 'primeng/skeleton';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FieldPipe } from 'src/app/shared/pipes/show-nested-field.pipe';

@Component({
  selector: 'app-order-source-list',
  templateUrl: './order-source-list.component.html',
  styleUrls: ['./order-source-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormsModule,
    TableModule,
    ButtonModule,
    ToastModule,
    PaginatorModule,
    BlockUIModule,
    SkeletonModule,
    ProgressSpinnerModule,
    DatePipe,
    CurrencyPipe,
    FieldPipe,
  ],
})
export class OrderSourceListComponent implements OnInit {
  private readonly orderSourceService = inject(OrderSourceService);
  readonly paginationConstants = inject(PaginationConstants);
  private readonly modalService = inject(ModalService);
  private readonly messageService = inject(MessageService);
  private readonly utilService = inject(UtilService);
  private readonly destroyRef = inject(DestroyRef);

  orderSources = signal<Array<OrderSource>>([]);
  orderSourcesResponseMetadata = signal<any>(null);
  columns = [
    {
      field: 'name',
      header: 'Name',
      type: 'string',
    },
    {
      field: 'type',
      header: 'Type',
      type: 'string',
    },
    {
      field: 'description',
      header: 'Description',
      type: 'string',
    },
    {
      field: 'createdAt',
      header: 'Created Date',
      type: 'date',
    },
  ];
  sortOrder: number = 0;
  sortField: string = '';
  isLoading = signal(false);
  startingRow = signal(0);

  ngOnInit(): void {
    this.startingRow.set(this.paginationConstants.FIRST_ROW);
    this.getOrderSources();
  }

  getOrderSources(params = {}): void {
    this.isLoading.set(true);
    this.orderSourceService
      .getOrderSources(params)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: CustomResponse<OrderSource[]>) => {
          this.orderSources.set(response?.payload ?? []);
          this.orderSourcesResponseMetadata.set(response?.metadata);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
          this.orderSources.set([]);
        },
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
    this.getOrderSources(queryParams);
  }

  openCreateOrderSourcerModal(): void {
    this.modalService
      .open(CreateOrderSourceComponent, { title: 'Create Order Source' }, { header: 'Create Order Source' })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((isConfirmed) => {
        if (isConfirmed) this.getOrderSources();
      });
  }

  openEditOrderSourceModal(orderSource: OrderSource): void {
    this.modalService
      .open(EditOrderSourceComponent, { title: 'Edit Order Source', orderSource }, { header: 'Edit Order Source' })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((isConfirmed) => {
        if (isConfirmed) {
          const requestParams = {
            page: this.utilService.getFromLocalStorage(ListConstants.CURRENT_PAGE) ?? 1,
          };
          this.getOrderSources(requestParams);
        }
      });
  }

  onDelete(orderSource: OrderSource): void {
    const description = `Are you sure you want to delete this order source with name "${orderSource?.name}"?`;
    const toastMessage = 'Order source deleted!';
    this.modalService
      .open(ConfirmationModalComponent, {
        modalTitle: 'Delete Order Source',
        modalDescription: description,
      }, { header: 'Delete Order Source' })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((isConfirmed) => {
        if (isConfirmed) {
          this.orderSourceService
            .deleteOrderSourceById(orderSource.id as number)
            .pipe(
              tap(() => this.showToast(toastMessage)),
              tap(() => this.setCurrentPage()),
              switchMap(() => of(this.getOrderSources())),
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

  private setCurrentPage(): void {
    this.startingRow.set(
      this.utilService.getFromLocalStorage(ListConstants.CURRENT_ROWS)
    );
  }
}
