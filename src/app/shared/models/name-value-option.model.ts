export class NameValueOption {
  name: string;
  value: string;

  constructor(option: any) {
    this.name = option?.name;
    this.value = option?.value;
  }
}
