import { Customer } from '../../customers/models/customer.model';
import { Product } from '../../product/models/product.model';

export class Order {
  id?: number;
  description: string;
  quantity?: number;
  amount: number;
  paymentMethod: string;
  weight?: string;
  customizeName?: string;
  customer?: Customer;
  products?: Array<Product>;
  productCount?: number;
  createdAt: Date;

  constructor(order: any) {
    this.id = order?.id;
    this.description = order?.description;
    this.quantity = order?.quantity;
    this.amount = order?.amount;
    this.paymentMethod = order?.paymentMethod;
    this.customizeName = order.customizeName;
    this.weight = order?.weight;
    this.createdAt = order.createdAt;
    if (order?.products?.length) {
      this.products = order?.products.map(
        (product: any) => new Product(product)
      );
    }
    this.productCount = order?.products?.length ?? 0;
    if (order?.customer) {
      this.customer = new Customer(order?.customer);
    }
  }
}
