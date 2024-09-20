export interface GroupedSeriesDataItem {
  value: number;
  groupId: string;
}

export type GroupedDataList = [string, number];

export interface DrillDownDataItem {
  dataGroupId: string;
  data: Array<GroupedDataList>;
}

export interface DeepBarGraphData {
  xAxis: Array<string>;
  groupedSeries: Array<GroupedSeriesDataItem>;
  drillDownData: Array<DrillDownDataItem>;
}
