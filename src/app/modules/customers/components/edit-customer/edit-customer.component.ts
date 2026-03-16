import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Validators } from '@angular/forms';
import { CreateCustomerComponent } from '../create-customer/create-customer.component';
import { Customer } from '../../models/customer.model';
import { Country } from 'src/app/shared/models';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { forkJoin, switchMap, tap } from 'rxjs';

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
    const form = this.formBuilder.group({
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
    this.customerForm.set(form);
    this.subscribeToCountryChanges();
  }

  override saveCustomer(): void {
    this.updateProduct();
  }

  override initializeDataAndBuildForm(): void {
    this.loadingService.show('Loading...');
    this.fetchEditFormData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.buildForm();
          this.populateCountryProvinceCity();
          this.loadingService.hide();
        },
        error: () => this.loadingService.hide(),
      });
  }

  private fetchEditFormData() {
    return forkJoin({
      countries: this.countryCityService.getCountries(),
      provinces: this.countryCityService.getProvinces(),
    }).pipe(
      tap(({ countries, provinces }) => {
        this.countries = countries;
        this.provinces = provinces;
      }),
      switchMap(({ countries }) => {
        const customerCountry = this.findItem(countries, this.customer?.country, 'name');
        const countryCode = customerCountry?.code ?? this.defaultCountryCode;
        return this.countryCityService.getCitiesByCountry(countryCode).pipe(
          tap((cities) => { this.cities.set(cities); })
        );
      })
    );
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
    const selectedCountry = this.findItem(this.countries, this.customer?.country, 'name');
    const selectedProvince = this.findItem(this.provinces, this.customer?.province, 'name');
    const selectedCity = this.findItem(this.cities(), this.customer?.city, 'name');
    // emitEvent: false prevents subscribeToCountryChanges from reloading cities
    // when programmatically setting the initial values
    this.customerForm()?.patchValue(
      { country: selectedCountry, province: selectedProvince, city: selectedCity },
      { emitEvent: false }
    );
  }

  findItem<T>(list: T[], value: string, key: keyof T): T | undefined {
    return list.find(
      (item) => item[key]?.toString().toLowerCase() === value?.toLowerCase()
    );
  }
}
