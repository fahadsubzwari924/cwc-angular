import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SimpleModalComponent } from 'ngx-simple-modal';
import { ProgressSpinner } from 'primeng/progressspinner';
import { Customer } from '../../models/customer.model';
import { CustomerService } from '../../services/customer.service';
import { CountryCityService } from 'src/app/shared/services/country-city.service';
import { City, Country, Province } from 'src/app/shared/models';
import { forkJoin, switchMap, tap } from 'rxjs';

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

  countries: Array<Country> = [];
  cities: Array<City> = [];
  provinces: Array<Province> = [];
  defaultCountryCode = 'PK';

  constructor(
    protected formBuilder: FormBuilder,
    protected customerService: CustomerService,
    protected countryCityService: CountryCityService
  ) {
    super();
    this.spinner = new ProgressSpinner();
  }

  ngOnInit(): void {
    this.initializeDataAndBuildForm();
  }

  buildForm(): void {
    this.customerForm = this.formBuilder.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      contactNumber: ['', [Validators.required]],
      address: ['', [Validators.required]],
      country: [null, [Validators.required]],
      province: ['', [Validators.required]],
      city: [null, [Validators.required]],
      age: [''],
    });
  }

  saveCustomer() {
    this.createCustomer();
  }

  createCustomer(): void {
    this.showSpinner = true;
    const payload = this.buildPayload();
    this.customerService
      .createCustomer(payload)
      .subscribe((response: Customer) => {
        this.closeModal();
      });
  }

  closeModal() {
    this.showSpinner = false;
    this.result = true;
    this.close();
  }

  buildPayload(): Partial<Customer> {
    const customerFormValue = this.customerForm?.value;
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
    this.showSpinner = true;
    this.fetchDataForFormInitialization().subscribe({
      next: () => {
        this.buildForm();
        this.setDefaultCountry();
        this.showSpinner = false;
      },
    });
  }

  fetchDataForFormInitialization() {
    this.showSpinner = true;
    return forkJoin({
      countries: this.countryCityService.getCountries(),
      provinces: this.countryCityService.getProvinces(),
    }).pipe(
      tap(({ countries, provinces }) => {
        this.countries = countries;
        this.provinces = provinces;
      }),
      switchMap(({ countries }) => {
        const defaultCountry = this.getDefaultCountry(countries);
        return this.countryCityService.getCities().pipe(
          tap((cities) => {
            this.cities = cities.filter(
              (city) => city.country === defaultCountry?.code
            );
          })
        );
      })
    );
  }

  private getDefaultCountry(countries: Array<Country> = []): Country | null {
    const countriesToBeFiltered = countries.length ? countries : this.countries;
    const country = countriesToBeFiltered.find(
      (country) => country.code === this.defaultCountryCode
    );
    return country ?? null;
  }

  private setDefaultCountry(): void {
    const defaultCountry = this.getDefaultCountry();
    if (defaultCountry) {
      this.customerForm.patchValue({ country: defaultCountry });
    }
  }
}
