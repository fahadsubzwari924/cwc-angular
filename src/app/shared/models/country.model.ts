export class Country {
  name: string;
  code: string;

  constructor(country: any) {
    this.name = country?.name;
    this.code = country?.code;
  }
}
