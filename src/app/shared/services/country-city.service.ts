import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { City } from '../models/city.model';
import { Country } from '../models/country.model';
import { Province } from '../models';

@Injectable({
  providedIn: 'root',
})
export class CountryCityService {
  private readonly http = inject(HttpClient);

  getCountries(): Observable<Array<Country>> {
    return this.http
      .get<Array<Country>>('assets/data/countries.json')
      .pipe(map((data) => data.map((item) => new Country(item))));
  }

  getProvinces(): Observable<Array<Province>> {
    return this.http
      .get<Array<Province>>('assets/data/provinces.json')
      .pipe(map((data) => data.map((item) => new Province(item))));
  }

  /**
   * Loads cities for a specific country from a pre-split per-country file.
   * Each file lives at assets/data/cities/{countryCode}.json and is generated
   * from the full world dataset, keeping only the relevant subset.
   * This reduces payload from ~14MB to ~27KB for PK, for example.
   */
  getCitiesByCountry(countryCode: string): Observable<Array<City>> {
    return this.http
      .get<Array<Omit<City, 'country'>>>(`assets/data/cities/${countryCode}.json`)
      .pipe(map((data) => data.map((item) => new City({ ...item, country: countryCode }))));
  }
}
