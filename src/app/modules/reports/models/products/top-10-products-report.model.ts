export class TopTenBestPerformingProductsReport {
  productName: string;
  orderCount: number;

  constructor(report: any) {
    this.productName = report?.productName;
    this.orderCount = report?.orderCount;
  }
}
