import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateCustomerComponent } from '../create-customer/create-customer.component';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/customer.model';

@Component({
  selector: 'app-edit-product',
  templateUrl: '../create-customer/create-customer.component.html',
  styleUrls: ['../create-customer/create-customer.component.scss'],
})
export class EditCustomerComponent
  extends CreateCustomerComponent
  implements OnInit
{
  customer!: Customer;

  constructor(
    override formBuilder: FormBuilder,
    override customerService: CustomerService
  ) {
    super(formBuilder, customerService);
  }

  override ngOnInit(): void {
    this.buildForm();
  }

  override buildForm(): void {
    this.customerForm = this.formBuilder.group({
      id: [this.customer?.id],
      fullName: [
        this.customer?.fullName,
        [Validators.required, Validators.minLength(5)],
      ],
      contactNumber: [this.customer?.contactNumber, [Validators.required]],
      address: [this.customer?.address, [Validators.required]],
      city: [this.customer?.city, [Validators.required]],
      age: [this.customer?.age],
      country: [this.customer?.country],
    });
  }

  override saveCustomer(): void {
    this.updateProduct();
  }

  updateProduct(): void {
    this.showSpinner = true;
    this.customerService
      .updateCustomer(this.customerForm.value)
      .subscribe((response: any) => {
        this.closeModal();
      });
  }
}
