export interface ReportsData {}

export interface OrderDemographicsData extends ReportsData {
  province: string;
  orderCount: number;
  percentage: number;
}

export interface MonthlyOrdersReportData extends ReportsData {
  month: string;
  orderCount: number;
}

export interface YearlyOrdersReportData extends ReportsData {
  month: string;
  orderCount: number;
}

export interface OrdersSummaryReportData extends ReportsData {
  year: number;
  orderCount: number;
  ordersByMonth: Array<MonthlyOrdersReportData>;
}
