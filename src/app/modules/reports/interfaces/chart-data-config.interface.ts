export interface ChartSeriesKeyConfig {
  field: string;
  name: string;
}

export interface ChartDataConfig {
  nameKey?: string;
  valueKey?: string;
  xAxisKey?: string;
  yAxisKey?: string;
  groupedDataKey?: string;
  /** When set, build grouped bar series from these row fields. */
  seriesKeys?: ChartSeriesKeyConfig[];
}
