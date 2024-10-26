import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { CustomResponse, NameValueOption } from 'src/app/shared/models';
import { ReportType } from '../models/report-type.model';
import { ApiService } from 'src/app/shared/services/api.service';
import { ApiPaths } from 'src/app/shared/enums/api-paths';
import { ReportDataMapperService } from './report-data-mapper.service';
import { map as lodashMap } from 'lodash';
import { ReportData } from '../models/report-data.model';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  constructor(
    private http: HttpClient,
    private apiService: ApiService,
    private reportDataMapperService: ReportDataMapperService
  ) {}

  // Fetch and map countries
  getReportCategories(): Observable<Array<NameValueOption>> {
    return this.http
      .get<Array<NameValueOption>>('assets/data/report-entities.json')
      .pipe(map((data) => data.map((item) => new NameValueOption(item))));
  }

  getReportTypes(): Observable<Array<ReportType>> {
    return this.http
      .get<Array<ReportType>>('assets/data/report-types.json')
      .pipe(map((data) => data.map((item) => new ReportType(item))));
  }

  getReport(
    reportTypes: Array<ReportType>,
    params?: any
  ): Observable<CustomResponse<Array<ReportData>>> {
    const formattedReportTypes = lodashMap(
      reportTypes,
      (reportType: ReportType) => ({
        name: reportType.value,
        category: reportType.category,
      })
    );
    return this.apiService
      .httpPost(ApiPaths.Reports, {
        reportTypes: formattedReportTypes,
        ...params,
      })
      .pipe(
        map(
          (response: any) =>
            new CustomResponse(response, (data) =>
              this.reportDataMapperService.mapReportsData(reportTypes, data)
            )
        )
      );
  }
}
