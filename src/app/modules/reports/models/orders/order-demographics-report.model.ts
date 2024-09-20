export class OrdersDemographicsReport {
  province: string;
  orderCount: number;
  percentage: number;

  constructor(orderDemographicsReport: any) {
    this.province = orderDemographicsReport.province;
    this.orderCount = orderDemographicsReport.orderCount;
    this.percentage = orderDemographicsReport.percentage;
  }
}
