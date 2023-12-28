import { Customer } from '../../customers/models/customer.model';
import { OrderProduct } from './order-product.model';

export class Order {
  id?: number;
  description: string;
  quantity?: number;
  amount: number;
  totalWeight: string;
  weight?: string;
  customer?: Customer;
  products?: Array<OrderProduct>;
  productCount?: number;
  status?: string;
  createdAt?: Date;

  constructor(order: any) {
    this.id = order?.id;
    this.description = order?.description;
    this.quantity = order?.quantity;
    this.amount = order?.amount;
    this.totalWeight = order?.totalWeight;
    this.createdAt = order.createdAt;
    this.status = order?.status;
    if (order?.products?.length) {
      this.products = order?.products.map(
        (product: any) => new OrderProduct(product)
      );
    }
    this.productCount = order?.products?.length ?? 0;
    if (order?.customer) {
      this.customer = new Customer(order?.customer);
    }
  }
}
