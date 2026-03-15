import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ModalService } from 'src/app/shared/services/modal.service';
import { MessageService } from 'primeng/api';
import {
  Observable,
  debounceTime,
  distinctUntilChanged,
  map,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { ConfirmationModalComponent } from 'src/app/shared/components/confirmation-modal/confirmation-modal.component';
import { PaginationConstants } from 'src/app/shared/constants/pagination.constants';
import { CustomResponse } from 'src/app/shared/models/response.model';
import { Customer } from '../../models/customer.model';
import { CustomerService } from '../../services/customer.service';
import { CreateCustomerComponent } from '../create-customer/create-customer.component';
import { EditCustomerComponent } from '../edit-customer/edit-customer.component';
import { UtilService } from '../../../../util/util.service';
import { ListConstants } from 'src/app/constants/list-constants';
import { AutoCompleteCompleteEvent } from 'src/app/modules/order/interfaces/order-product.interface';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { PaginatorModule } from 'primeng/paginator';
import { BlockUIModule } from 'primeng/blockui';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { SkeletonModule } from 'primeng/skeleton';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormsModule,
    TableModule,
    ButtonModule,
    ToastModule,
    PaginatorModule,
    BlockUIModule,
    AutoCompleteModule,
    SkeletonModule,
    ProgressSpinnerModule,
  ],
})
export class CustomerListComponent implements OnInit {
  private readonly customerService = inject(CustomerService);
  readonly paginationConstants = inject(PaginationConstants);
  private readonly modalService = inject(ModalService);
  private readonly messageService = inject(MessageService);
  private readonly utilService = inject(UtilService);
  private readonly destroyRef = inject(DestroyRef);

  customers = signal<Array<Customer>>([]);
  customerResponseMetadata = signal<any>(null);
  columns = [
    {
      field: 'fullName',
      header: 'Name',
    },
    {
      field: 'contactNumber',
      header: 'Contact Number',
    },
    {
      field: 'address',
      header: 'Address',
    },
    {
      field: 'age',
      header: 'Age',
    },
    {
      field: 'ordersCount',
      header: 'Orders',
    },
  ];
  sortOrder: number = 0;
  sortField: string = '';
  isLoading = signal(false);
  startingRow = signal(0);
  customerSuggestions = signal<Array<Customer>>([]);

  ngOnInit(): void {
    this.startingRow.set(this.paginationConstants.FIRST_ROW);
    this.getCustomers();
  }

  getCustomers(params = {}): void {
    this.isLoading.set(true);
    this.customerService
      .getCustomers(params)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: CustomResponse<Customer[]>) => {
          this.customers.set(response?.payload ?? []);
          this.customerResponseMetadata.set(response.metadata);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
          this.customers.set([]);
        },
      });
  }

  onSortChange(event: any) {
    const value = event.value;

    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    } else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }

  openCreateCustomerModal(): void {
    this.modalService
      .open(CreateCustomerComponent, { title: 'Create Customer' }, {
        header: 'Create Customer',
        width: '580px',
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((isConfirmed) => {
        if (isConfirmed) this.getCustomers();
      });
  }

  openEditCustomerModal(customer: Customer): void {
    this.modalService
      .open(EditCustomerComponent, { title: 'Edit Customer', customer }, {
        header: 'Edit Customer',
        width: '580px',
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((isConfirmed) => {
        if (isConfirmed) {
          const requestParams = {
            page: this.utilService.getFromLocalStorage(ListConstants.CURRENT_PAGE) ?? 1,
          };
          this.getCustomers(requestParams);
        }
      });
  }

  onDelete(customer: Customer): void {
    const description = `Are you sure you want to delete this customer with name "${customer.fullName}"?`;
    const toastMessage = 'Customer deleted!';
    this.modalService
      .open(ConfirmationModalComponent, {
        modalTitle: 'Delete Customer',
        modalDescription: description,
      }, { header: 'Delete Customer' })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((isConfirmed) => {
        if (isConfirmed) {
          this.customerService
            .deleteCustomer(customer.id as number)
            .pipe(
              tap(() => this.showToast(toastMessage)),
              tap(() => this.setCurrentPage()),
              switchMap(() => of(this.getCustomers())),
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
    this.getCustomers(queryParams);
  }

  searchForCustomers(searchTerm: string): Observable<Array<Customer>> {
    let queryParams = {
      searchTerm,
    };
    return this.customerService.searchCustomers(queryParams);
  }

  searchCustomer(event: any): void {
    of(event)
      .pipe(
        debounceTime(500),
        map(
          (customerAutocompleteEvent: AutoCompleteCompleteEvent) =>
            customerAutocompleteEvent.query
        ),
        distinctUntilChanged(),
        switchMap((searchTerm: string) => this.searchForCustomers(searchTerm)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((customers: Array<Customer>) => {
        this.customerSuggestions.set(customers);
      });
  }

  getSelectedCustomer(selectedCustomer: any): void {
    const queryParams = {
      filters: JSON.stringify({ fullName: selectedCustomer?.fullName }),
    };
    this.getCustomers(queryParams);
  }

  onCustomerUnSelect(): void {
    this.getCustomers();
  }

  private setCurrentPage(): void {
    this.startingRow.set(
      this.utilService.getFromLocalStorage(ListConstants.CURRENT_ROWS)
    );
  }
}
