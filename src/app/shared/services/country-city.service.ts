import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { City } from '../models/city.model';
import { Country } from '../models/country.model';
import { Province } from '../models';

@Injectable({
  providedIn: 'root',
})
export class CountryCityService {
  constructor(private http: HttpClient) {}

  // Fetch and map countries
  getCountries(): Observable<Array<Country>> {
    return this.http
      .get<Array<Country>>('assets/data/countries.json')
      .pipe(map((data) => data.map((item) => new Country(item))));
  }

  // Fetch and map cities
  getProvinces(): Observable<Array<Province>> {
    return this.http
      .get<Array<Province>>('assets/data/provinces.json')
      .pipe(map((data) => data.map((item) => new Province(item))));
  }

  // Fetch and map cities
  getCities(): Observable<Array<City>> {
    return this.http
      .get<Array<City>>('assets/data/cities.json')
      .pipe(map((data) => data.map((item) => new City(item))));
  }
}
