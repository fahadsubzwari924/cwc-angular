export class MonthlyOrdersReport {
  month: string;
  orderCount: number;

  constructor(monthlyOrdersReport: any) {
    this.month = monthlyOrdersReport?.month;
    this.orderCount = monthlyOrdersReport?.orderCount;
  }
}
