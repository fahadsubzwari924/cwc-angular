import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsComponent } from './reports.component';
import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsService } from './services/reports.service';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { BlockUIModule } from 'primeng/blockui';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { OrdersReportComponent } from './components/orders-report/orders-report.component';
import { CustomersReportComponent } from './components/customers-report/customers-report.component';
import { SharedModule } from '../../shared/shared.module';
import { ReportDataService } from './services/report-data.service';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { ReportDataMapperService } from './services/report-data-mapper.service';
import { ChartService } from './services/chart.service';
import { ReportCssService } from './services/report-css.service';

@NgModule({
  declarations: [
    ReportsComponent,
    OrdersReportComponent,
    CustomersReportComponent,
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    DropdownModule,
    FormsModule,
    BlockUIModule,
    ProgressSpinnerModule,
    SharedModule,
    CalendarModule,
    MultiSelectModule,
  ],
  providers: [
    ReportsService,
    ReportDataService,
    ReportDataMapperService,
    ChartService,
    ReportCssService,
  ],
})
export class ReportsModule {}
