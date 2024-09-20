import {
  MonthlyOrdersReport,
  OrdersDemographicsReport,
  OrdersSummaryReport,
  YearlyOrdersReport,
} from '../models/orders';

export type OrdersData =
  | Array<OrdersDemographicsReport>
  | Array<MonthlyOrdersReport>
  | Array<YearlyOrdersReport>
  | Array<OrdersSummaryReport>;
