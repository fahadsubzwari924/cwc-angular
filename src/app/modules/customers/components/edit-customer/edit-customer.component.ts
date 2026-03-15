import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Validators } from '@angular/forms';
import { CreateCustomerComponent } from '../create-customer/create-customer.component';
import { Customer } from '../../models/customer.model';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
@Component({
  selector: 'app-edit-customer',
  templateUrl: '../create-customer/create-customer.component.html',
  styleUrls: ['../create-customer/create-customer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    DropdownModule,
    InputTextModule,
  ],
})
export class EditCustomerComponent
  extends CreateCustomerComponent
  implements OnInit
{
  get customer(): Customer {
    return this.data?.['customer'] as Customer;
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
    this.loadingService.show('Loading...');
    this.fetchDataForFormInitialization()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.buildForm();
          this.populateCountryProvinceCity();
          this.loadingService.hide();
        },
      });
  }

  updateProduct(): void {
    this.loadingService.show('Updating customer...');
    const payload = this.buildPayload();
    payload.id = this.customer?.id;
    this.customerService
      .updateCustomer(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.closeModal(),
        error: () => this.loadingService.hide(),
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
