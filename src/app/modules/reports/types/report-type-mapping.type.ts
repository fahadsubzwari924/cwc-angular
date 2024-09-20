import { ChartTypes } from '../enums/chart-types.enum';
import { BarGraphData, ChartSeriesData } from '../interfaces';

export type ReportTypeMapping = {
  [ChartTypes.PieChart]: Array<ChartSeriesData>;
  [ChartTypes.BarGraph]: BarGraphData;
};
