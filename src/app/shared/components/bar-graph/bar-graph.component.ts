import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  Input,
  OnChanges,
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [],
})
export class BarGraphComponent implements AfterViewInit, OnDestroy, OnChanges {
  private readonly elementRef = inject(ElementRef);

  @Input() chartHeight: number = 400;
  @Input() data!: BarGraphData;
  @Input() title!: string;
  @Input() chartId!: string;
  @Input() tooltipTitle!: string;
  @Input() chartType?: ChartTypes;
  @Input() showLegends?: boolean;

  private barGraphChart!: echarts.ECharts;
  private chartInitialized: boolean = false;

  ngAfterViewInit(): void {
    this.initChart();
  }

  ngOnChanges(): void {
    if (this.barGraphChart && this.chartInitialized && this.hasRenderableBarData()) {
      this.updateChart();
    }
  }

  private hasRenderableBarData(): boolean {
    const xLen = this.data?.xAxis?.length ?? 0;
    if (!xLen) {
      return false;
    }
    if (this.data.series?.length) {
      return this.data.series.every((s) => (s.data?.length ?? 0) === xLen);
    }
    return (this.data.yAxis?.length ?? 0) === xLen;
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
        this.chartInitialized = true;
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

  private computeYAxisMax(): number | undefined {
    let dataMax = 0;
    if (this.data?.series?.length) {
      for (const s of this.data.series) {
        for (const v of s.data ?? []) {
          dataMax = Math.max(dataMax, Number(v) || 0);
        }
      }
    } else {
      const yValues = this.data?.yAxis ?? [];
      dataMax = yValues.length ? Math.max(...yValues, 0) : 0;
    }
    return dataMax === 0 ? 10 : undefined;
  }

  private getChartOption(): EChartsOption {
    const yAxisMax = this.computeYAxisMax();
    const base: Pick<
      EChartsOption,
      'tooltip' | 'grid' | 'xAxis' | 'yAxis'
    > = {
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
        data: this.data?.xAxis ?? [],
        axisTick: {
          alignWithLabel: true,
        },
      },
      yAxis: {
        type: 'value',
        min: 0,
        ...(yAxisMax !== undefined ? { max: yAxisMax } : {}),
      },
    };

    if (this.data?.series?.length) {
      const showLegend = this.showLegends !== false;
      return {
        ...base,
        legend: showLegend ? { show: true, top: 0 } : { show: false },
        series: this.data.series.map((s) => ({
          name: s.name,
          type: 'bar' as const,
          data: s.data,
          barGap: '0%',
          barWidth: '22%',
        })),
      };
    }

    const yValues = this.data?.yAxis ?? [];
    return {
      ...base,
      series: [
        {
          name: this.tooltipTitle,
          data: yValues,
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
