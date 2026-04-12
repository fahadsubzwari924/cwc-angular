export class YearlyProfitReport {
  year: number;
  revenue: number;
  profit: number;

  constructor(row: { year?: unknown; revenue?: unknown; profit?: unknown }) {
    this.year = Number(row?.year) || 0;
    this.revenue = Number(row?.revenue) || 0;
    this.profit = Number(row?.profit) || 0;
  }
}
