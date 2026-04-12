import { ReportCssService } from './report-css.service';
import { ReportData } from '../models/report-data.model';
import { ChartTypes } from '../enums/chart-types.enum';
import { ReportType } from '../models/report-type.model';

function makeReportType(partial: Partial<ReportType> & { value: string }): ReportType {
  return new ReportType({
    name: partial.name ?? partial.value,
    value: partial.value,
    category: partial.category ?? 'orders',
    title: partial.title ?? partial.value,
    chartType: partial.chartType ?? ChartTypes.PieChart,
    dataConfig: partial.dataConfig ?? {},
    requiredParams: {},
    tooltipTitle: '',
    showLegends: false,
  });
}

describe('ReportCssService', () => {
  let service: ReportCssService;

  beforeEach(() => {
    service = new ReportCssService();
  });

  it('pairs two pie charts as col-6 and keeps bar chart col-12 (selection order preserved)', () => {
    const pieA = new ReportData(
      makeReportType({ value: 'orders_percentage_by_province' }),
      []
    );
    const bar = new ReportData(
      makeReportType({
        value: 'monthly_orders',
        chartType: ChartTypes.BarGraph,
        dataConfig: { xAxisKey: 'm', yAxisKey: 'c' },
      }),
      []
    );
    const pieB = new ReportData(
      makeReportType({ value: 'orders_percentage_by_source' }),
      []
    );

    const input = [pieA, bar, pieB];
    const out = service.assignCssClasses(input);

    expect(out).toBe(input);
    expect(pieA.cssClasses).toBe('col-6');
    expect(bar.cssClasses).toBe('col-12');
    expect(pieB.cssClasses).toBe('col-6');
  });

  it('uses full width for every report when only one pie is present among multiple reports', () => {
    const pie = new ReportData(
      makeReportType({ value: 'p1' }),
      []
    );
    const bar = new ReportData(
      makeReportType({
        value: 'b1',
        chartType: ChartTypes.BarGraph,
        dataConfig: { xAxisKey: 'm', yAxisKey: 'c' },
      }),
      []
    );
    const input = [pie, bar];
    service.assignCssClasses(input);
    expect(pie.cssClasses).toBe('col-12');
    expect(bar.cssClasses).toBe('col-12');
  });
});
