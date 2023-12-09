import { TitleCasePipe } from '@angular/common';
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
  status?: string;
  createdAt?: Date;
  titleCasePipe: TitleCasePipe;

  constructor(order: any) {
    this.titleCasePipe = new TitleCasePipe();
    this.id = order?.id;
    this.description = order?.description;
    this.quantity = order?.quantity;
    this.amount = order?.amount;
    this.paymentMethod = order?.paymentMethod;
    this.customizeName = order.customizeName;
    this.weight = order?.weight;
    this.createdAt = order.createdAt;
    this.status = this.titleCasePipe.transform(order?.status);
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
