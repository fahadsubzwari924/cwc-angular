export class OrdersByOrderSource {
  sourceName: string;
  orderCount: number;
  percentage: number;

  constructor(orderByOrderSourceReport: any) {
    this.sourceName = orderByOrderSourceReport?.sourceName;
    this.orderCount = orderByOrderSourceReport?.orderCount;
    this.percentage = orderByOrderSourceReport?.percentage;
  }
}
