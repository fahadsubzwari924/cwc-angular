import { Injectable } from '@angular/core';
import { ReportData } from '../models/report-data.model';
import { ChartTypes } from '../enums/chart-types.enum';

@Injectable({
  providedIn: 'root',
})
export class ReportCssService {
  private readonly FULL_WIDTH_CLASS = 'col-12';
  private readonly HALF_WIDTH_CLASS = 'col-6';

  assignCssClasses(reports: Array<ReportData>): Array<ReportData> {
    if (reports.length === 0) {
      return reports;
    }

    if (reports.length === 1) {
      return this.assignClassToSingleReport(reports);
    }

    const pieChartReports = reports.filter(
      (report) => report.chartType === ChartTypes.PieChart
    );
    const barGraphReports = reports.filter((report) =>
      [ChartTypes.BarGraph, ChartTypes.BarGraphDeep].includes(report.chartType)
    );

    if (pieChartReports.length >= 2) {
      this.applyPairedPieWidths(pieChartReports);
      barGraphReports.forEach(
        (report) => (report.cssClasses = this.FULL_WIDTH_CLASS)
      );
      reports.forEach((report) => {
        if (!this.isPieChart(report) && !this.isBarChart(report)) {
          report.cssClasses = this.FULL_WIDTH_CLASS;
        }
      });
      return reports;
    }

    return this.assignFullWidthToAllReports(reports);
  }

  private isPieChart(report: ReportData): boolean {
    return report.chartType === ChartTypes.PieChart;
  }

  private isBarChart(report: ReportData): boolean {
    return [ChartTypes.BarGraph, ChartTypes.BarGraphDeep].includes(
      report.chartType
    );
  }

  private applyPairedPieWidths(pieChartReports: Array<ReportData>): void {
    const isOdd = pieChartReports.length % 2 !== 0;
    pieChartReports.forEach((report, index) => {
      if (isOdd && index === pieChartReports.length - 1) {
        report.cssClasses = this.FULL_WIDTH_CLASS;
      } else {
        report.cssClasses = this.HALF_WIDTH_CLASS;
      }
    });
  }

  private assignClassToSingleReport(
    reports: Array<ReportData>
  ): Array<ReportData> {
    reports[0].cssClasses = this.FULL_WIDTH_CLASS;
    return reports;
  }

  private assignFullWidthToAllReports(
    reports: Array<ReportData>
  ): Array<ReportData> {
    reports.forEach((report) => {
      report.cssClasses = this.FULL_WIDTH_CLASS;
    });
    return reports;
  }
}
