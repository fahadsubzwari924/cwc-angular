export class OrderProduct {
  id: number;
  name: string;
  cost: number;
  /** Unit cost captured when the line was sold (when API provides it). */
  unitCostSnapshot?: number | null;
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
    this.unitCostSnapshot = orderProduct.unitCostSnapshot;
    this.price = orderProduct.price;
    this.weight = orderProduct.weight;
    this.customizeName = orderProduct.customizeName;
    this.color = orderProduct.color;
    this.quantity = orderProduct.quantity;
    this.createdAt = orderProduct.createdAt;
  }
}
