export class Product {
  id?: number;
  name: string;
  description: string;
  cost: number;
  price?: number;
  weight: string;
  createdAt: Date;

  constructor(product: any) {
    this.id = product?.id;
    this.name = product?.name;
    this.description = product?.description;
    this.cost = product?.cost;
    this.weight = product?.weight;
    this.createdAt = product?.createdAt;
  }
}
