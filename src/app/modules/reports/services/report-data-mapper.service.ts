import { Injectable } from '@angular/core';
import { ReportType } from '../models/report-type.model';
import { REPORT_MODEL_REGISTRY } from '../models/models-registry';
import { ReportData } from '../models/report-data.model';

@Injectable({
  providedIn: 'root',
})
export class ReportDataMapperService {
  constructor() {}

  mapReportsData(
    reportTypes: Array<ReportType>,
    data: any
  ): Record<string, any> {
    const mappedResults: Record<string, any> = {};

    reportTypes.forEach((reportType) => {
      const { value: name, category } = reportType;

      // Ensure category data exists
      const categoryData = data[category];
      if (!categoryData) {
        throw new Error(`No data found for category: ${category}`);
      }

      // Ensure specific report data exists
      const reportData = categoryData[name];
      if (!reportData) {
        throw new Error(`No data found for report type: ${name}`);
      }

      // Retrieve corresponding model class
      const ModelClass = REPORT_MODEL_REGISTRY[name];
      if (!ModelClass) {
        throw new Error(`Invalid report type: ${name}`);
      }

      // Map data to the respective model class
      const mappedData = reportData.map((item: any) => new ModelClass(item));
      mappedResults[name] = new ReportData(reportType, mappedData);
    });

    return mappedResults;
  }
}
