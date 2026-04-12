import {
  BarGraphData,
  DeepBarGraphData,
} from 'src/app/shared/interfaces';

export interface ChartSeriesData {
  name: string;
  value: number;
}

export type { BarGraphData };

export interface LineGraphData {
  xAxis: Array<string>;
  series: Array<{ name: string; data: Array<number> }>;
}

export type ChartData =
  | Array<ChartSeriesData>
  | BarGraphData
  | LineGraphData
  | DeepBarGraphData;
