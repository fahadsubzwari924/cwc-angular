import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ReportsService } from './services/reports.service';
import { CustomResponse, NameValueOption } from 'src/app/shared/models';
import { ReportType } from './models/report-type.model';
import { INameValue } from 'src/app/shared/interfaces';
import { ReportFilters } from './interfaces';
import { first, last } from 'lodash';
import { ReportData } from './models/report-data.model';
import { ReportCssService } from './services/report-css.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  reportCategories: Array<NameValueOption> = [];
  selectedReportCategories!: Array<string>;
  selectedReportTypes: Array<ReportType> = [];
  selectedYear!: number;
  selectedDateRange: any;
  reportTypes: Array<ReportType> = [];
  yearOptions = [
    {
      name: 2022,
      value: 2022,
    },
    {
      name: 2023,
      value: 2023,
    },
    {
      name: 2024,
      value: 2024,
    },
    {
      name: 2025,
      value: 2025,
    },
  ];

  ordersDemographicsReportData: Array<INameValue> = [];
  showSpinner = false;
  yearDisabled = true;
  reports: Array<ReportData> = [];

  constructor(
    private reportsService: ReportsService,
    private cdRef: ChangeDetectorRef,
    private reportCssService: ReportCssService
  ) {}

  ngOnInit(): void {
    this.getReportCategories();
  }

  getReportCategories(): void {
    this.reportsService.getReportCategories().subscribe({
      next: (reportCategories: Array<NameValueOption>) => {
        this.reportCategories = reportCategories;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  getReportTypes(): void {
    this.reportsService.getReportTypes().subscribe({
      next: (reportTypes: Array<ReportType>) => {
        if (reportTypes?.length) {
          this.reportTypes = reportTypes.filter((reportType: ReportType) =>
            this.selectedReportCategories.includes(reportType.category)
          );
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  onSelectReportType(): void {
    this.selectedReportTypes.some((reportType: ReportType) => {
      if (reportType.requiredParams.year) {
        this.yearDisabled = false;
      }
    });
  }

  getOrdersReport(): void {
    const filters = { filters: this.buildReportFilters() };
    this.showSpinner = true;
    this.reportsService.getReport(this.selectedReportTypes, filters).subscribe({
      next: (reports: CustomResponse<Record<string, any>>) => {
        const rawReports = Object.values(reports.payload);
        this.reports = this.reportCssService.assignCssClasses(rawReports);
        this.showSpinner = false;
        this.cdRef.detectChanges();
      },
      error: (error) => {
        this.showSpinner = false;
        console.log(error);
      },
    });
  }

  buildReportFilters(): ReportFilters {
    const reportFilters: ReportFilters = {};
    if (this.selectedYear) {
      reportFilters.year = this.selectedYear;
    }
    if (this.selectedDateRange) {
      reportFilters.dateRange = {
        startDate: first(this.selectedDateRange) as Date,
        endDate: last(this.selectedDateRange) as Date,
      };
    }

    return reportFilters;
  }
}
