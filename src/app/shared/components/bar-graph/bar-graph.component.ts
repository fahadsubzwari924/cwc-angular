import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
} from '@angular/core';
import { BarGraphData } from '../../interfaces';
import * as echarts from 'echarts';
import { ChartTypes } from 'src/app/modules/reports/enums/chart-types.enum';

type EChartsOption = echarts.EChartsOption;

@Component({
  selector: 'app-bar-graph',
  templateUrl: './bar-graph.component.html',
  styleUrls: ['./bar-graph.component.scss'],
})
export class BarGraphComponent implements AfterViewInit, OnDestroy {
  @Input() chartHeight: number = 400;

  @Input() data!: BarGraphData;
  @Input() title!: string;
  @Input() chartId!: string;
  @Input() tooltipTitle!: string;
  @Input() chartType?: ChartTypes;

  private barGraphChart!: echarts.ECharts;
  private chartInitialized: boolean = false;

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit(): void {
    this.initChart();
  }

  ngOnChanges(): void {
    if (
      this.barGraphChart &&
      this.data?.xAxis?.length &&
      this.data?.yAxis?.length &&
      this.chartInitialized
    ) {
      this.updateChart();
    }
  }

  initChart(): void {
    const barGraphChartDom = this.elementRef.nativeElement.querySelector(
      `#${this.chartId}`
    );
    if (barGraphChartDom) {
      try {
        this.barGraphChart = echarts.init(barGraphChartDom);
        const option: EChartsOption = this.getChartOption();
        this.barGraphChart.setOption(option);
        console.log('Bar graph chart updated successfully');
      } catch (error) {
        console.error('Error initializing bar graph chart:', error);
      }
    } else {
      console.error(`Element with id ${this.chartId} not found`);
      setTimeout(() => this.initChart(), 100);
    }
  }

  private updateChart(): void {
    if (this.barGraphChart) {
      try {
        const option: EChartsOption = this.getChartOption();
        this.barGraphChart.setOption(option);
        console.log('bar graph chart updated successfully');
      } catch (error) {
        console.error('Error updating chart:', error);
      }
    }
  }

  private getChartOption(): EChartsOption {
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: this.data.xAxis,
        axisTick: {
          alignWithLabel: true,
        },
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: this.tooltipTitle,
          data: this.data.yAxis,
          type: 'bar',
          barWidth: '60%',
        },
      ],
    };
  }

  ngOnDestroy(): void {
    if (this.barGraphChart) {
      this.barGraphChart.dispose();
    }
  }
}
