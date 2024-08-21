export class City {
  name: string;
  country: string;
  lat: string;
  lng: string;

  constructor(city: any) {
    this.name = city?.name;
    this.country = city?.country;
    this.lat = city?.lat;
    this.lng = city?.lng;
  }
}
