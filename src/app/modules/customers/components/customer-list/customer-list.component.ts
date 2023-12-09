import { Component } from '@angular/core';
import { SimpleModalService } from 'ngx-simple-modal';
import { MessageService } from 'primeng/api';
import { of, switchMap, tap } from 'rxjs';
import { ConfirmationModalComponent } from 'src/app/shared/components/confirmation-modal/confirmation-modal.component';
import { PaginationConstants } from 'src/app/shared/constants/pagination.constants';
import { CustomResponse } from 'src/app/shared/models/response.model';
import { Customer } from '../../models/customer.model';
import { CustomerService } from '../../services/customer.service';
import { CreateCustomerComponent } from '../create-customer/create-customer.component';
import { EditCustomerComponent } from '../edit-customer/edit-customer.component';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
})
export class CustomerListComponent {
  constructor(
    private customerService: CustomerService,
    public paginationConstants: PaginationConstants,
    private modalService: SimpleModalService,
    private messageService: MessageService
  ) {}

  customers: Array<Customer> = [];
  customerResponseMetadata: any;
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

  ngOnInit(): void {
    this.getCustomers();
  }

  getCustomers(params = {}): void {
    this.customerService
      .getCustomers(params)
      .subscribe((response: CustomResponse<Customer[]>) => {
        this.customers = response?.payload;
        this.customerResponseMetadata = response.metadata;
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
    const inputs = {
      title: 'Create Customer',
    };
    this.modalService
      .addModal(CreateCustomerComponent, inputs)
      .subscribe((isConfirmed) => {
        console.log('isConfirmed : ', isConfirmed);
        if (isConfirmed) {
          this.getCustomers();
        }
      });
  }

  openEditCustomerModal(customer: Customer): void {
    const inputs = {
      title: 'Edit Customer',
      customer,
    };
    this.modalService
      .addModal(EditCustomerComponent, inputs)
      .subscribe((isConfirmed) => {
        if (isConfirmed) {
          this.getCustomers();
        }
      });
  }

  onDelete(customer: Customer): void {
    const description = `Are you sure you want to delete this customer with name "${customer.fullName}"?`;
    const toastMessage = 'Customer deleted!';
    this.modalService
      .addModal(ConfirmationModalComponent, {
        modalTitle: 'Delete Customer',
        modalDescription: description,
      })
      .subscribe((isConfirmed) => {
        if (isConfirmed) {
          this.customerService
            .deleteCustomer(customer.id as number)
            .pipe(
              tap(() => this.showToast(toastMessage)),
              switchMap(() => of(this.getCustomers()))
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
    const queryParams = {
      page: paginationEvent?.page + 1,
    };
    this.getCustomers(queryParams);
  }
}