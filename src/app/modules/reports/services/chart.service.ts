import { Type } from '@angular/core';
import { BarGraphComponent } from 'src/app/shared/components/bar-graph/bar-graph.component';
import { PieChartComponent } from 'src/app/shared/components/pie-chart/pie-chart.component';
import { ChartTypes } from '../enums/chart-types.enum';
import { DeepBarGraphComponent } from 'src/app/shared/components/deep-bar-graph/deep-bar-graph.component';

// Define the map for chart components
const chartComponentMap = {
  [ChartTypes.BarGraph]: BarGraphComponent,
  [ChartTypes.BarGraphDeep]: DeepBarGraphComponent,
  [ChartTypes.PieChart]: PieChartComponent,
} as const; // This makes sure the values are treated as constants (specific types, not just Type<any>).

export class ChartService {
  // Use generics to infer the exact type of the component
  getChartComponent<T extends ChartTypes>(
    chartType: T
  ): (typeof chartComponentMap)[T] {
    const chartComponent = chartComponentMap[chartType];

    if (!chartComponent) {
      throw new Error(`Unsupported chart type: ${chartType}`);
    }

    return chartComponent;
  }
}
