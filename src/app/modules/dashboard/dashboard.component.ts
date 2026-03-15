import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgClass, NgStyle } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { LoadingService } from 'src/app/core/services/loading.service';
import { CustomResponse } from 'src/app/shared/models/response.model';
import { ReportsService as DashboardReportService } from 'src/app/shared/services/reports.service';
import { DashboardStatsModel, DashboardStatsPropertyModel } from './model/dashboard.model';
import { ReportsService } from '../reports/services/reports.service';
import { ReportCssService } from '../reports/services/report-css.service';
import { ReportData } from '../reports/models/report-data.model';
import { ReportType } from '../reports/models/report-type.model';
import { catchError, iif, of, switchMap, tap } from 'rxjs';
import { ChartHostComponent } from 'src/app/shared/components/chart-host/chart-host.component';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgClass, NgStyle, SkeletonModule, ChartHostComponent],
})
export class DashboardComponent implements OnInit {
  private readonly dashboardReportService = inject(DashboardReportService);
  private readonly reportService = inject(ReportsService);
  private readonly reportCssService = inject(ReportCssService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly loadingService = inject(LoadingService);

  dashboardStats = signal<DashboardStatsModel | null>(null);
  /** Precomputed array for template iteration; replaces keyvalue pipe. */
  dashboardStatsArray = computed(() => {
    const stats = this.dashboardStats();
    if (!stats) return [];
    return Object.entries(stats).map(([key, value]) => ({
      key,
      value: value as DashboardStatsPropertyModel,
    }));
  });
  isLoading = signal(false);
  dashboardStatusProperties = 8;
  /** Stable array for @for to avoid ExpressionChangedAfterItHasBeenCheckedError (iterator creates new ref each run). */
  readonly skeletonIndices: number[] = Array.from(
    { length: 8 },
    (_, i) => i
  );
  reports = signal<ReportData[]>([]);
  monthlyReport = signal<ReportType | undefined>(undefined);

  ngOnInit() {
    this.getDashboardStats();
    this.loadReports();
  }

  getDashboardStats(): void {
    this.isLoading.set(true);
    this.dashboardReportService
      .getDashboardStats()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: CustomResponse<DashboardStatsModel>) => {
          this.dashboardStats.set(response?.payload ?? {});
          this.isLoading.set(false);
        },
        error: (error) => {
          this.isLoading.set(false);
          console.log(error);
        },
      });
  }

  loadReports(): void {
    this.loadingService.show('Loading reports...');

    this.getReportTypes()
      .pipe(
        switchMap((reportTypes: Array<ReportType>) => {
          const monthly = this.findMonthlyReport(reportTypes);
          queueMicrotask(() => this.monthlyReport.set(monthly));
          return iif(
            () => !!monthly,
            this.fetchReportsForType(monthly!),
            of({ payload: [] })
          );
        }),
        tap((response) => this.handleReports(response)),
        catchError(this.handleError.bind(this)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        error: this.stopSpinner.bind(this),
      });
  }

  private getReportTypes() {
    return this.reportService.getReportTypes();
  }

  private findMonthlyReport(
    reportTypes: Array<ReportType>
  ): ReportType | undefined {
    return reportTypes.find(
      (reportType: ReportType) => reportType.value === 'monthly_orders'
    );
  }

  private fetchReportsForType(reportType: ReportType) {
    const selectedReportTypes = [reportType];
    const filters = { filters: { year: new Date().getFullYear() } };
    return this.reportService.getReport(selectedReportTypes, filters);
  }

  private handleReports(
    response: CustomResponse<Array<ReportData>> | { payload: never[] }
  ): void {
    const payload = response.payload || [];
    // Defer signal update to next tick to avoid NG0100
    queueMicrotask(() => {
      this.reports.set(payload);
      this.stopSpinner();
    });
  }

  private handleError(error: any) {
    console.error('Error fetching report types or reports:', error);
    this.stopSpinner();
    return of({ payload: [] });
  }

  private stopSpinner(): void {
    this.loadingService.hide();
  }
}
