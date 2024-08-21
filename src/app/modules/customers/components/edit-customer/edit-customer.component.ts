import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CreateCustomerComponent } from '../create-customer/create-customer.component';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/customer.model';
import { CountryCityService } from 'src/app/shared/services/country-city.service';

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
    override customerService: CustomerService,
    override countryCityService: CountryCityService
  ) {
    super(formBuilder, customerService, countryCityService);
  }

  override ngOnInit(): void {
    this.initializeDataAndBuildForm();
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
      city: ['', [Validators.required]],
      age: [this.customer?.age],
      country: ['', [Validators.required]],
      province: ['', [Validators.required]],
    });
  }

  override saveCustomer(): void {
    this.updateProduct();
  }

  override initializeDataAndBuildForm(): void {
    this.showSpinner = true;
    this.fetchDataForFormInitialization().subscribe({
      next: () => {
        this.buildForm();
        this.populateCountryProvinceCity();
        this.showSpinner = false;
      },
    });
  }

  updateProduct(): void {
    this.showSpinner = true;
    const payload = this.buildPayload();
    payload.id = this.customer?.id;
    this.customerService.updateCustomer(payload).subscribe((response: any) => {
      this.closeModal();
    });
  }

  populateCountryProvinceCity(): void {
    const selectedCountry = this.findRelevantCountryProvinceCity(
      this.countries,
      this.customer?.country,
      'name'
    );
    const selectedProvince = this.findRelevantCountryProvinceCity(
      this.provinces,
      this.customer?.province,
      'name'
    );
    const selectedCity = this.findRelevantCountryProvinceCity(
      this.cities,
      this.customer?.city,
      'name'
    );
    this.customerForm.patchValue({
      country: selectedCountry,
      province: selectedProvince,
      city: selectedCity,
    });
  }

  findRelevantCountryProvinceCity<T>(
    list: T[],
    customerValue: string,
    key: keyof T
  ): T | undefined {
    return list.find(
      (item) =>
        item[key]?.toString().toLowerCase() === customerValue?.toLowerCase()
    );
  }
}
