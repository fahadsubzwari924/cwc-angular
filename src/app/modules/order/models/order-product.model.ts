export class OrderProduct {
  id: number;
  name: string;
  cost: number;
  price: number;
  weight: string;
  customizeName: string;
  color: string;
  quantity: number;
  createdAt: Date;

  constructor(orderProduct: any) {
    this.id = orderProduct.id;
    this.name = orderProduct.name;
    this.cost = orderProduct.cost;
    this.price = orderProduct.price;
    this.weight = orderProduct.weight;
    this.customizeName = orderProduct.customizeName;
    this.color = orderProduct.color;
    this.quantity = orderProduct.quantity;
    this.createdAt = orderProduct.createdAt;
  }
}
