import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SimpleModalComponent } from 'ngx-simple-modal';
import { ProgressSpinner } from 'primeng/progressspinner';
import { Customer } from '../../models/customer.model';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-create-customer',
  templateUrl: './create-customer.component.html',
  styleUrls: ['./create-customer.component.scss'],
})
export class CreateCustomerComponent
  extends SimpleModalComponent<null, boolean>
  implements OnInit
{
  title!: string;

  customerForm!: FormGroup;
  spinner!: ProgressSpinner;
  showSpinner = false;

  constructor(
    protected formBuilder: FormBuilder,
    protected customerService: CustomerService
  ) {
    super();
    this.spinner = new ProgressSpinner();
  }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    this.customerForm = this.formBuilder.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      contactNumber: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      age: [''],
      country: [''],
    });
  }

  saveCustomer() {
    this.createCustomer();
  }

  createCustomer(): void {
    this.showSpinner = true;
    this.customerService
      .createCustomer(this.customerForm.value)
      .subscribe((response: Customer) => {
        this.closeModal();
      });
  }

  closeModal() {
    this.showSpinner = false;
    this.result = true;
    this.close();
  }
}
