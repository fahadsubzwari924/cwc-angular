import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
} from '@angular/core';
import { ChartSeriesData } from '../../interfaces';
import * as echarts from 'echarts';

type EChartsOption = echarts.EChartsOption;

@Component({
  selector: 'cwc-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
})
export class PieChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() chartHeight: number = 400;
  @Input() tooltipFormat?: string = '<b>{b}: {c}%</b>';
  @Input() tooltipTitle!: string;
  @Input() data: Array<ChartSeriesData> = [];
  @Input() title!: string;
  @Input() subTitle?: string;
  @Input() chartId!: string;
  @Input() showLegends: boolean = true;

  private pieChart!: echarts.ECharts;
  private chartInitialized: boolean = false;

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit(): void {
    this.initChart();
  }

  ngOnChanges(): void {
    if (this.chartInitialized && this.data?.length) {
      this.updateChart();
    }
  }

  initChart(): void {
    const pieChartDom = this.elementRef.nativeElement.querySelector(
      `#${this.chartId}`
    );
    if (pieChartDom) {
      try {
        this.pieChart = echarts.init(pieChartDom);
        const option: EChartsOption = this.getChartOption();
        this.pieChart.setOption(option);
        this.chartInitialized = true;
        console.log('Pie Chart initialized successfully');
      } catch (error) {
        console.error('Error initializing chart:', error);
      }
    } else {
      console.error(`Element with id ${this.chartId} not found`);
      setTimeout(() => this.initChart(), 100);
    }
  }

  private updateChart(): void {
    if (this.pieChart) {
      try {
        const option: EChartsOption = this.getChartOption();
        this.pieChart.setOption(option);
        console.log('Chart updated successfully');
      } catch (error) {
        console.error('Error updating chart:', error);
      }
    }
  }

  private getChartOption(): EChartsOption {
    return {
      title: {
        text: this.title,
        subtext: this.subTitle,
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
        formatter: this.tooltipFormat,
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        show: this.showLegends,
      },
      series: [
        {
          name: this.tooltipTitle,
          type: 'pie',
          radius: '50%',
          data: this.data,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };
  }

  ngOnDestroy(): void {
    if (this.pieChart) {
      this.pieChart.dispose();
    }
  }
}
