import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
} from '@angular/core';
import { DeepBarGraphData, GroupedSeriesDataItem } from '../../interfaces';
import * as echarts from 'echarts';
import { ChartTypes } from 'src/app/modules/reports/enums/chart-types.enum';

type EChartsOption = echarts.EChartsOption;

@Component({
  selector: 'cwc-deep-bar-graph',
  templateUrl: './deep-bar-graph.component.html',
  styleUrls: ['./deep-bar-graph.component.scss'],
})
export class DeepBarGraphComponent implements AfterViewInit, OnDestroy {
  @Input() chartHeight: number = 400;

  @Input() data!: DeepBarGraphData;
  @Input() title!: string;
  @Input() chartId!: string;
  @Input() tooltipTitle!: string;
  @Input() chartType?: ChartTypes;

  private deepBarGraphChart!: echarts.ECharts;
  private chartInitialized: boolean = false;

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit(): void {
    this.initChart();
  }

  ngOnChanges(): void {
    if (
      this.deepBarGraphChart &&
      this.data?.xAxis?.length &&
      this.data?.groupedSeries?.length &&
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
        this.deepBarGraphChart = echarts.init(barGraphChartDom);
        const option: EChartsOption = this.getChartOption();
        this.deepBarGraphChart.setOption(option);
        this.setupDrilldownHandler();
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
    if (this.deepBarGraphChart) {
      try {
        const option: EChartsOption = this.getChartOption();
        this.deepBarGraphChart.setOption(option);
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
      yAxis: {},
      series: [
        {
          id: 'orders',
          type: 'bar',
          barWidth: '60%',
          data: this.data.groupedSeries,
          universalTransition: {
            enabled: true,
            divideShape: 'clone',
          },
        },
      ],
    };
  }

  private setupDrilldownHandler(): void {
    this.deepBarGraphChart.on('click', (event) => {
      if (event?.data) {
        const subData = this.data.drillDownData.find(function (data) {
          return (
            data.dataGroupId === (event.data as GroupedSeriesDataItem).groupId
          );
        });
        if (!subData) {
          return;
        }

        this.deepBarGraphChart.setOption<echarts.EChartsOption>({
          xAxis: {
            data: subData.data.map(function (item) {
              return item[0];
            }),
          },
          series: {
            type: 'bar',
            id: 'orders',
            dataGroupId: subData.dataGroupId,
            data: subData.data.map(function (item) {
              return item[1];
            }),
            universalTransition: {
              enabled: true,
              divideShape: 'clone',
            },
          },
          graphic: [
            {
              type: 'text',
              left: 50,
              top: 20,
              style: {
                text: 'Back',
                fontSize: 18,
              },
              onclick: () => {
                this.deepBarGraphChart.setOption<echarts.EChartsOption>(
                  this.getChartOption()
                );
              },
            },
          ],
        });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.deepBarGraphChart) {
      this.deepBarGraphChart.dispose();
    }
  }
}
