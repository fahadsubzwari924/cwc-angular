import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReportsService } from './services/reports.service';
import { CustomResponse, NameValueOption } from 'src/app/shared/models';
import { ReportType } from './models/report-type.model';
import { INameValue } from 'src/app/shared/interfaces';
import { ReportFilters } from './interfaces';
import { first, last } from 'lodash-es';
import { ReportData } from './models/report-data.model';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { LoadingService } from 'src/app/core/services/loading.service';
import { DatePickerModule } from 'primeng/datepicker';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { OrdersReportComponent } from './components/orders-report/orders-report.component';
import { CustomersReportComponent } from './components/customers-report/customers-report.component';
import { ChartHostComponent } from 'src/app/shared/components/chart-host/chart-host.component';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgClass,
    FormsModule,
    DropdownModule,
    DatePickerModule,
    MultiSelectModule,
    ButtonModule,
    OrdersReportComponent,
    CustomersReportComponent,
    ChartHostComponent,
  ],
})
export class ReportsComponent implements OnInit {
  private readonly reportsService = inject(ReportsService);
  private readonly cdRef = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly loadingService = inject(LoadingService);

  reportCategories = signal<Array<NameValueOption>>([]);
  selectedReportCategories!: Array<string>;
  selectedReportTypes: Array<ReportType> = [];
  selectedYear!: number;
  selectedDateRange: any;
  reportTypes = signal<Array<ReportType>>([]);
  yearOptions = [
    { name: 2022, value: 2022 },
    { name: 2023, value: 2023 },
    { name: 2024, value: 2024 },
    { name: 2025, value: 2025 },
  ];

  ordersDemographicsReportData: Array<INameValue> = [];
  yearDisabled = signal(true);
  reports = signal<Array<ReportData>>([]);

  ngOnInit(): void {
    this.getReportCategories();
  }

  getReportCategories(): void {
    this.reportsService
      .getReportCategories()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (reportCategories: Array<NameValueOption>) => {
          this.reportCategories.set(reportCategories);
        },
        error: (error) => console.log(error),
      });
  }

  getReportTypes(): void {
    this.reportsService
      .getReportTypes()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (reportTypes: Array<ReportType>) => {
          if (reportTypes?.length) {
            this.reportTypes.set(
              reportTypes.filter((reportType: ReportType) =>
                this.selectedReportCategories.includes(reportType.category)
              )
            );
          }
        },
        error: (error) => console.log(error),
      });
  }

  onSelectReportType(): void {
    const yearDisabled = this.selectedReportTypes.some(
      (reportType: ReportType) => reportType.requiredParams?.year
    );
    this.yearDisabled.set(!yearDisabled);
  }

  getReports(): void {
    const filters = { filters: this.buildReportFilters() };
    this.loadingService.show('Loading reports...');
    this.reportsService
      .getReport(this.selectedReportTypes, filters)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (reports: CustomResponse<Array<ReportData>>) => {
          this.reports.set(reports.payload ?? []);
          this.loadingService.hide();
        },
        error: (error) => {
          this.loadingService.hide();
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
