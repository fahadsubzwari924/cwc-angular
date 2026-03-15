import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { OrdersReport } from '../../types/reports.types';
import { ReportType } from '../../models/report-type.model';
import { ChartHostComponent } from 'src/app/shared/components/chart-host/chart-host.component';

@Component({
  selector: 'app-orders-report',
  templateUrl: './orders-report.component.html',
  styleUrls: ['./orders-report.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ChartHostComponent],
})
export class OrdersReportComponent {
  @Input() ordersReportData!: Array<OrdersReport>;
  @Input() OrderReportTypes!: ReportType;
}
