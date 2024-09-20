import { DeepBarGraphData } from 'src/app/shared/interfaces';

export interface ChartSeriesData {
  name: string;
  value: number;
}

export interface BarGraphData {
  xAxis: Array<string>;
  yAxis: Array<number>;
}

export interface LineGraphData {
  xAxis: Array<string>;
  series: Array<{ name: string; data: Array<number> }>;
}

export type ChartData =
  | Array<ChartSeriesData>
  | BarGraphData
  | LineGraphData
  | DeepBarGraphData;
