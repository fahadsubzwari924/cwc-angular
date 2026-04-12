export interface BarGraphSeries {
  name: string;
  data: number[];
}

export interface BarGraphData {
  xAxis: string[];
  /** Single-series charts (existing behavior). */
  yAxis?: number[];
  /** Multi-series grouped bars. */
  series?: BarGraphSeries[];
}
