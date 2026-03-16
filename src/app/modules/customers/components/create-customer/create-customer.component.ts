import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BaseDialogComponent } from 'src/app/shared/components/base-dialog/base-dialog.component';
import { Customer } from '../../models/customer.model';
import { CustomerService } from '../../services/customer.service';
import { CountryCityService } from 'src/app/shared/services/country-city.service';
import { City, Country, Province } from 'src/app/shared/models';
import { forkJoin, tap } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { LoadingService } from 'src/app/core/services/loading.service';

@Component({
  selector: 'app-create-customer',
  templateUrl: './create-customer.component.html',
  styleUrls: ['./create-customer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    DropdownModule,
    InputTextModule,
  ],
})
export class CreateCustomerComponent extends BaseDialogComponent implements OnInit {
  protected readonly formBuilder = inject(FormBuilder);
  protected readonly customerService = inject(CustomerService);
  protected readonly countryCityService = inject(CountryCityService);
  protected readonly destroyRef = inject(DestroyRef);
  protected readonly loadingService = inject(LoadingService);

  get title(): string {
    return this.data?.['title'] ?? 'Create Customer';
  }

  readonly customerForm = signal<FormGroup | null>(null);

  countries: Array<Country> = [];
  readonly cities = signal<Array<City>>([]);
  provinces: Array<Province> = [];
  defaultCountryCode = 'PK';

  ngOnInit(): void {
    this.initializeDataAndBuildForm();
  }

  buildForm(): void {
    const form = this.formBuilder.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      contactNumber: ['', [Validators.required]],
      address: ['', [Validators.required]],
      country: [null, [Validators.required]],
      province: ['', [Validators.required]],
      city: [null, [Validators.required]],
      age: [''],
    });
    this.customerForm.set(form);
    this.subscribeToCountryChanges();
  }

  saveCustomer() {
    this.createCustomer();
  }

  createCustomer(): void {
    this.loadingService.show('Saving customer...');
    const payload = this.buildPayload();
    this.customerService
      .createCustomer(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.closeModal(),
        error: () => this.loadingService.hide(),
      });
  }

  closeModal(): void {
    this.loadingService.hide();
    this.close(true);
  }

  buildPayload(): Partial<Customer> {
    const customerFormValue = this.customerForm()?.value;
    return {
      fullName: customerFormValue?.fullName,
      contactNumber: customerFormValue?.contactNumber,
      address: customerFormValue?.address,
      country: customerFormValue?.country?.name,
      province: customerFormValue?.province?.name,
      city: customerFormValue?.city?.name,
      age: customerFormValue?.age,
    };
  }

  initializeDataAndBuildForm(): void {
    this.loadingService.show('Loading...');
    this.fetchDataForFormInitialization()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.buildForm();
          this.setDefaultCountry();
          this.loadingService.hide();
        },
        error: () => this.loadingService.hide(),
      });
  }

  fetchDataForFormInitialization() {
    return forkJoin({
      countries: this.countryCityService.getCountries(),
      provinces: this.countryCityService.getProvinces(),
      cities: this.countryCityService.getCitiesByCountry(this.defaultCountryCode),
    }).pipe(
      tap(({ countries, provinces, cities }) => {
        this.countries = countries;
        this.provinces = provinces;
        this.cities.set(cities);
      })
    );
  }

  protected loadCitiesForCountry(countryCode: string): void {
    this.countryCityService
      .getCitiesByCountry(countryCode)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((cities) => {
        this.cities.set(cities);
        this.customerForm()?.patchValue({ city: null });
      });
  }

  protected subscribeToCountryChanges(): void {
    this.customerForm()?.get('country')?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((country: Country | null) => {
        if (country?.code) {
          this.loadCitiesForCountry(country.code);
        } else {
          this.cities.set([]);
          this.customerForm()?.patchValue({ city: null });
        }
      });
  }

  protected getDefaultCountry(countries: Array<Country> = []): Country | null {
    const countriesToBeFiltered = countries.length ? countries : this.countries;
    const country = countriesToBeFiltered.find(
      (c) => c.code === this.defaultCountryCode
    );
    return country ?? null;
  }

  private setDefaultCountry(): void {
    const defaultCountry = this.getDefaultCountry();
    if (defaultCountry) {
      this.customerForm()?.patchValue({ country: defaultCountry }, { emitEvent: false });
    }
  }
}
