import {
  Component,
  ComponentRef,
  Input,
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
})
export class ChartHostComponent implements OnInit {
  @Input() reportData!: ReportData;

  @ViewChild('chartContainer', { read: ViewContainerRef, static: true })
  chartContainer!: ViewContainerRef;
  private componentRef: ComponentRef<any> | null = null;

  constructor(
    private chartService: ChartService,
    private reportsDataService: ReportDataService
  ) {}

  ngOnInit(): void {
    this.loadChartComponent();
  }

  private loadChartComponent(): void {
    const chartData = this.reportsDataService.generateReportData(
      this.reportData.chartType,
      this.reportData.data,
      this.reportData.dataConfig
    );
    const chartComponent: Type<
      PieChartComponent | BarGraphComponent | DeepBarGraphComponent
    > = this.chartService.getChartComponent(this.reportData.chartType);
    this.componentRef = this.chartContainer.createComponent(chartComponent);
    const chartId = `chart-${Math.random().toString(36).substr(2, 9)}`;

    Object.assign(this.componentRef.instance, {
      data: chartData,
      title: this.reportData?.title,
      chartId: chartId,
      subTitle: this.reportData.subTitle,
      tooltipFormat: this.reportData.tooltipFormat,
      tooltipTitle: this.reportData.tooltipTitle,
      showLegends: this.reportData.showLegends,
    });
  }

  ngOnDestroy(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }
}
