import {
  MonthlyOrdersReport,
  OrdersDemographicsReport,
  OrdersSummaryReport,
  YearlyOrdersReport,
} from '../models/orders';

export type OrdersReport =
  | OrdersDemographicsReport
  | MonthlyOrdersReport
  | YearlyOrdersReport
  | OrdersSummaryReport;
