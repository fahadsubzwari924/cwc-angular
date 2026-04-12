export class MonthlyProfitReport {
  month: string;
  revenue: number;
  profit: number;

  constructor(row: { month?: string; revenue?: unknown; profit?: unknown }) {
    this.month = row?.month ?? '';
    this.revenue = Number(row?.revenue) || 0;
    this.profit = Number(row?.profit) || 0;
  }
}
