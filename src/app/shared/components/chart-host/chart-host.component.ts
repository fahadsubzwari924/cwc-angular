import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  inject,
  input,
  OnInit,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ReportData } from 'src/app/modules/reports/models/report-data.model';
import { ChartService } from 'src/app/modules/reports/services/chart.service';
import { PieChartComponent } from '../pie-chart/pie-chart.component';
import { BarGraphComponent } from '../bar-graph/bar-graph.component';
import { ReportDataService } from 'src/app/modules/reports/services/report-data.service';
import { DeepBarGraphComponent } from '../deep-bar-graph/deep-bar-graph.component';

@Component({
  selector: 'cwc-chart-host',
  templateUrl: './chart-host.component.html',
  styleUrls: ['./chart-host.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [],
})
export class ChartHostComponent implements OnInit {
  private readonly chartService = inject(ChartService);
  private readonly reportsDataService = inject(ReportDataService);

  reportData = input.required<ReportData>();

  @ViewChild('chartContainer', { read: ViewContainerRef, static: true })
  chartContainer!: ViewContainerRef;
  private componentRef: ComponentRef<any> | null = null;

  ngOnInit(): void {
    this.loadChartComponent();
  }

  private loadChartComponent(): void {
    const data = this.reportData();
    const chartData = this.reportsDataService.generateReportData(
      data.chartType,
      data.data,
      data.dataConfig
    );
    const chartComponent: Type<
      PieChartComponent | BarGraphComponent | DeepBarGraphComponent
    > = this.chartService.getChartComponent(data.chartType);
    this.componentRef = this.chartContainer.createComponent(chartComponent);
    const chartId = `chart-${Math.random().toString(36).substr(2, 9)}`;

    Object.assign(this.componentRef.instance, {
      data: chartData,
      title: data?.title,
      chartId: chartId,
      subTitle: data.subTitle,
      tooltipFormat: data.tooltipFormat,
      tooltipTitle: data.tooltipTitle,
      showLegends: data.showLegends,
    });
  }

  ngOnDestroy(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }
}
