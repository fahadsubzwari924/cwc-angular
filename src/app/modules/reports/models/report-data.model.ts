import { ChartTypes } from '../enums/chart-types.enum';
import { ChartDataConfig } from '../interfaces';
import { ReportType } from './report-type.model';

export class ReportData {
  data: any;
  title: string;
  subTitle?: string;
  chartType: ChartTypes;
  dataConfig: ChartDataConfig;
  tooltipFormat: string;
  tooltipTitle: string;
  chartId!: string;
  showLegends: boolean;
  cssClasses: string;

  constructor(reportType: ReportType, reportData: any) {
    this.data = reportData;
    this.title = reportType?.title;
    this.subTitle = reportType?.subTitle ?? '';
    this.chartType = reportType?.chartType;
    this.dataConfig = reportType.dataConfig;
    this.tooltipFormat = reportType?.tooltipFormat;
    this.tooltipTitle = reportType?.tooltipTitle;
    this.chartId = `cwc-${reportType?.value}-${reportType?.chartType}`;
    this.showLegends = reportType?.showLegends;
    this.cssClasses = reportType?.cssClasses;
  }
}
