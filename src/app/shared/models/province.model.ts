export class Province {
  name: string;
  value: number;

  constructor(province: any) {
    this.name = province?.name;
    this.value = province?.value;
  }
}
