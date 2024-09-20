import { Injectable } from '@angular/core';
import {
  BarGraphData,
  DeepBarGraphData,
  ChartSeriesData,
  DrillDownDataItem,
  GroupedDataList,
  GroupedSeriesDataItem,
} from 'src/app/shared/interfaces';
import { ChartData } from '../interfaces/chart-data.interface';
import { CustomReport, ReportDataItem, ReportTypeHandlers } from '../types';
import { ChartTypes } from '../enums/chart-types.enum';
import { ChartDataConfig } from '../interfaces';
import { map, toLower } from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class ReportDataService {
  private reportTypeHandlers: ReportTypeHandlers = {
    [ChartTypes.PieChart]: this.buildPieChartData.bind(this),
    [ChartTypes.BarGraph]: this.buildBarGraphChartData.bind(this),
    [ChartTypes.BarGraphDeep]:
      this.buildDrilledDownBarGraphChartData.bind(this),
  };

  generateReportData(
    chartType: ChartTypes,
    data: CustomReport,
    dataConfig: ChartDataConfig
  ): ChartData {
    const handler = this.reportTypeHandlers[chartType];
    if (!handler) {
      throw new Error(`No handler found for chart type: ${chartType}`);
    }
    return handler(data, dataConfig);
  }

  private buildPieChartData<T extends ReportDataItem>(
    data: Array<T>,
    config: ChartDataConfig
  ): Array<ChartSeriesData> {
    return data.map((item) => ({
      name: item[config.nameKey as string] as string,
      value: item[config.valueKey as string] as number,
    }));
  }

  private buildBarGraphChartData<T extends ReportDataItem>(
    data: Array<T>,
    config: ChartDataConfig
  ): BarGraphData {
    const xAxisData: Array<string> = data.map(
      (item) => item[config.xAxisKey as string] as string
    );
    const yAxisData: Array<number> = data.map(
      (item) => item[config.yAxisKey as string] as number
    );

    return {
      xAxis: xAxisData,
      yAxis: yAxisData,
    };
  }

  private buildDrilledDownBarGraphChartData<T extends ReportDataItem>(
    data: Array<T>,
    config: ChartDataConfig
  ): DeepBarGraphData {
    const xAxisData: Array<string> = data.map(
      (item) => item[config.xAxisKey as string] as string
    );

    const groupedSeries: Array<GroupedSeriesDataItem> = map(data, (item) => ({
      groupId: toLower(item[config.xAxisKey as string].toString()),
      value: item[config.yAxisKey as string],
    }));

    const drillDownData = this.buildDrillDownSeriesData(data);

    return {
      xAxis: xAxisData,
      groupedSeries: groupedSeries,
      drillDownData: drillDownData,
    };
  }

  private buildDrillDownSeriesData(data: Array<any>): Array<DrillDownDataItem> {
    const drilledDownData = map(data, (yearData) => ({
      dataGroupId: toLower(yearData.year.toString()),
      data: map(
        yearData.orderByMonths,
        (monthData): GroupedDataList => [monthData.month, monthData.orderCount]
      ),
    }));
    return drilledDownData;
  }
}
