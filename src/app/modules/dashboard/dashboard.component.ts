import { Component } from '@angular/core';
import { CustomResponse } from 'src/app/shared/models/response.model';
import { ReportsService as DashboardReportService } from 'src/app/shared/services/reports.service';
import { DashboardStatsModel } from './model/dashboard.model';
import { ReportsService } from '../reports/services/reports.service';
import { ReportCssService } from '../reports/services/report-css.service';
import { ReportData } from '../reports/models/report-data.model';
import { ReportType } from '../reports/models/report-type.model';
import { catchError, iif, of, switchMap, tap } from 'rxjs';

@Component({
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  dashboardStats!: DashboardStatsModel;
  isLoading = false;
  dashboardStatusProperties = 8;
  showSpinner = false;
  reports: Array<ReportData> = [];
  monthlyReport!: ReportType | undefined;

  constructor(
    private dashboardReportService: DashboardReportService,
    private reportService: ReportsService,
    private reportCssService: ReportCssService
  ) {}

  ngOnInit() {
    this.getDashboardStats();
    this.loadReports();
  }

  getDashboardStats(): void {
    this.isLoading = true;
    this.dashboardReportService.getDashboardStats().subscribe(
      (response: CustomResponse<DashboardStatsModel>) => {
        this.dashboardStats = response?.payload ?? {};
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        console.log(error);
      }
    );
  }

  /**
   * High-level method to load report data.
   * It first fetches report types, selects the monthly report, and then fetches the relevant reports.
   */
  loadReports(): void {
    this.showSpinner = true;

    this.getReportTypes()
      .pipe(
        switchMap((reportTypes: Array<ReportType>) => {
          this.monthlyReport = this.findMonthlyReport(reportTypes);
          return iif(
            () => !!this.monthlyReport,
            this.fetchReports(),
            of({ payload: [] })
          );
        }),
        tap((response) => this.handleReports(response)),
        catchError(this.handleError.bind(this))
      )
      .subscribe({
        error: this.stopSpinner.bind(this),
      });
  }

  /**
   * Fetch report types from the service.
   */
  private getReportTypes() {
    return this.reportService.getReportTypes();
  }

  /**
   * Find the 'monthly_orders' report type.
   */
  private findMonthlyReport(
    reportTypes: Array<ReportType>
  ): ReportType | undefined {
    return reportTypes.find(
      (reportType: ReportType) => reportType.value === 'monthly_orders'
    );
  }

  /**
   * Fetch reports based on the selected report type and filters.
   */
  private fetchReports() {
    const selectedReportTypes = [this.monthlyReport] as Array<ReportType>;
    const filters = { filters: { year: new Date().getFullYear() } };

    return this.reportService.getReport(selectedReportTypes, filters);
  }

  /**
   * Handle the fetched report data.
   */
  private handleReports(
    response: CustomResponse<Array<ReportData>> | { payload: never[] }
  ): void {
    this.reports = response.payload || [];
    this.stopSpinner();
    console.log(this.reports);
  }

  /**
   * Handle errors during fetching report types or reports.
   */
  private handleError(error: any) {
    console.error('Error fetching report types or reports:', error);
    this.stopSpinner();
    return of({ payload: [] }); // Return an empty payload on error
  }

  /**
   * Stop the spinner.
   */
  private stopSpinner() {
    this.showSpinner = false;
  }
}
