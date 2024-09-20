export class YearlyOrdersReport {
  year: number;
  orderCount: number;

  constructor(yearlyOrdersReport: any) {
    this.year = yearlyOrdersReport?.year;
    this.orderCount = yearlyOrdersReport?.orderCount;
  }
}
