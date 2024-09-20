import { DeepBarGraphData } from 'src/app/shared/interfaces';
import { ChartTypes } from '../enums/chart-types.enum';
import { BarGraphData, ChartDataConfig, ChartSeriesData } from '../interfaces';
import { ReportDataItem } from './report-data-item.type';

export type ReportTypeHandlers = {
  [ChartTypes.PieChart]: (
    data: ReportDataItem[],
    config: ChartDataConfig
  ) => Array<ChartSeriesData>;
  [ChartTypes.BarGraph]: (
    data: ReportDataItem[],
    config: ChartDataConfig
  ) => BarGraphData;

  [ChartTypes.BarGraphDeep]: (
    data: ReportDataItem[],
    config: ChartDataConfig
  ) => DeepBarGraphData;
};
