import { Order } from './../../order/models/order.model';
export class Customer {
  id?: number;
  fullName: string;
  contactNumber: string;
  age: number;
  country?: number;
  city: string;
  address: string;
  orders?: Array<Order>;
  ordersCount: number;
  createdAt: Date;
  updatedAt?: Date;

  constructor(customer: any) {
    this.id = customer?.id;
    this.fullName = customer?.fullName;
    this.contactNumber = customer?.contactNumber;
    this.address = customer?.address;
    this.age = customer?.age;
    this.city = customer?.city;
    this.country = customer?.country;
    this.createdAt = customer?.createdAt;
    this.updatedAt = customer?.updatedAt;
    this.ordersCount = customer?.orders?.length ?? 0;
    if (customer?.orders?.length) {
      this.orders = customer?.orders.map((order: any) => new Order(order));
    }
  }
}
