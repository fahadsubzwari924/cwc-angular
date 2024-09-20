import { TopTenBestPerformingProductsReport } from './products';
import {
  OrdersByOrderSource,
  YearlyOrdersReport,
  OrdersSummaryReport,
  OrdersDemographicsReport,
  MonthlyOrdersReport,
} from './orders';

export const REPORT_MODEL_REGISTRY: { [key: string]: any } = {
  orders_percentage_by_province: OrdersDemographicsReport,
  monthly_orders: MonthlyOrdersReport,
  yearly_orders: YearlyOrdersReport,
  order_summary: OrdersSummaryReport,
  top_performing_products: TopTenBestPerformingProductsReport,
  orders_percentage_by_source: OrdersByOrderSource,
};
