import { MonthlyOrdersReport } from './monthly-orders-report.model';

export class OrdersSummaryReport {
  year: number;
  orderCount: number;
  orderByMonths: Array<MonthlyOrdersReport>;

  constructor(ordersSummaryReport: any) {
    this.year = ordersSummaryReport?.year;
    this.orderCount = ordersSummaryReport?.orderCount;
    this.orderByMonths = ordersSummaryReport.orderByMonths.map(
      (monthlyOrder: MonthlyOrdersReport) =>
        new MonthlyOrdersReport(monthlyOrder)
    );
  }
}
