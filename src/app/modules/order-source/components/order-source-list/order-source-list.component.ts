import { Component } from '@angular/core';
import { SimpleModalService } from 'ngx-simple-modal';
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

@Component({
  selector: 'app-order-source-list',
  templateUrl: './order-source-list.component.html',
  styleUrls: ['./order-source-list.component.scss'],
})
export class OrderSourceListComponent {
  constructor(
    private orderSourceService: OrderSourceService,
    public paginationConstants: PaginationConstants,
    private modalService: SimpleModalService,
    private messageService: MessageService,
    private utilService: UtilService
  ) {}

  orderSources: Array<OrderSource> = [];
  orderSourcesResponseMetadata: any;
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
  isLoading = false;
  startingRow = 0;

  ngOnInit(): void {
    this.startingRow = this.paginationConstants.FIRST_ROW;
    this.getOrderSources();
  }

  getOrderSources(params = {}): void {
    this.isLoading = true;
    this.orderSourceService.getOrderSources(params).subscribe(
      (response: CustomResponse<OrderSource[]>) => {
        this.orderSources = response?.payload ?? [];
        this.orderSourcesResponseMetadata = response?.metadata;
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        this.orderSources = [];
      }
    );
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
    this.getOrderSources(queryParams);
  }

  openCreateOrderSourcerModal(): void {
    const inputs = {
      title: 'Create Order Source',
    };
    this.modalService
      .addModal(CreateOrderSourceComponent, inputs)
      .subscribe((isConfirmed) => {
        if (isConfirmed) {
          this.getOrderSources();
        }
      });
  }

  openEditOrderSourceModal(orderSource: OrderSource): void {
    const inputs = {
      title: 'Edit Order Source',
      orderSource,
    };
    this.modalService
      .addModal(EditOrderSourceComponent, inputs)
      .subscribe((isConfirmed) => {
        if (isConfirmed) {
          const requestParams = {
            page:
              this.utilService.getFromLocalStorage(
                ListConstants.CURRENT_PAGE
              ) ?? 1,
          };
          this.getOrderSources(requestParams);
        }
      });
  }

  onDelete(orderSource: OrderSource): void {
    const description = `Are you sure you want to delete this order source with name "${orderSource?.name}"?`;
    const toastMessage = 'Order source deleted!';
    this.modalService
      .addModal(ConfirmationModalComponent, {
        modalTitle: 'Delete Order Source',
        modalDescription: description,
      })
      .subscribe((isConfirmed) => {
        if (isConfirmed) {
          this.orderSourceService
            .deleteOrderSourceById(orderSource.id as number)
            .pipe(
              tap(() => this.showToast(toastMessage)),
              tap(() => this.setCurrentPage()),
              switchMap(() => of(this.getOrderSources()))
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
    this.startingRow = this.utilService.getFromLocalStorage(
      ListConstants.CURRENT_ROWS
    );
  }
}
