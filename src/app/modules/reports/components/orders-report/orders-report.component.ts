import { Component, Input } from '@angular/core';
import { OrdersReport } from '../../types/reports.types';
import { ReportType } from '../../models/report-type.model';

@Component({
  selector: 'app-orders-report',
  templateUrl: './orders-report.component.html',
  styleUrls: ['./orders-report.component.scss'],
})
export class OrdersReportComponent {
  @Input() ordersReportData!: Array<OrdersReport>;
  @Input() OrderReportTypes!: ReportType;
}
