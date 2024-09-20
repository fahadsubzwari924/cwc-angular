import { ChartTypes } from '../enums/chart-types.enum';
import { ChartDataConfig } from '../interfaces';

export class RequiredParams {
  year: boolean;
  dateRange: boolean;

  constructor(requiredParams: any) {
    this.year = requiredParams?.year;
    this.dateRange = requiredParams?.dateRange;
  }
}

export class ReportType {
  name: string;
  value: string;
  category: string;
  title: string;
  subTitle?: string;
  chartType: ChartTypes;
  dataConfig: ChartDataConfig;
  requiredParams: RequiredParams;
  tooltipFormat: string;
  tooltipTitle: string;
  showLegends: boolean;
  cssClasses: string;

  constructor(reportType: any) {
    this.name = reportType?.name;
    this.value = reportType?.value;
    this.category = reportType?.category;
    this.title = reportType?.title;
    this.subTitle = reportType?.subTitle ?? '';
    this.chartType = reportType?.chartType;
    this.dataConfig = reportType.dataConfig;
    this.requiredParams = new RequiredParams(reportType.requiredParams);
    this.tooltipFormat = reportType?.tooltipFormat;
    this.tooltipTitle = reportType?.tooltipTitle;
    this.showLegends = reportType?.showLegends;
    this.cssClasses = reportType?.cssClasses;
  }
}
