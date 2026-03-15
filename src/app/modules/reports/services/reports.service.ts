import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay } from 'rxjs';
import { CustomResponse, NameValueOption } from 'src/app/shared/models';
import { ReportType } from '../models/report-type.model';
import { ApiService } from 'src/app/shared/services/api.service';
import { ApiPaths } from 'src/app/shared/enums/api-paths';
import { ReportDataMapperService } from './report-data-mapper.service';
import { map as lodashMap } from 'lodash-es';
import { ReportData } from '../models/report-data.model';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  private readonly http = inject(HttpClient);
  private readonly apiService = inject(ApiService);
  private readonly reportDataMapperService = inject(ReportDataMapperService);

  private reportCategoriesCache$: Observable<Array<NameValueOption>> | null =
    null;
  private reportTypesCache$: Observable<Array<ReportType>> | null = null;

  getReportCategories(): Observable<Array<NameValueOption>> {
    if (!this.reportCategoriesCache$) {
      this.reportCategoriesCache$ = this.http
        .get<Array<NameValueOption>>('assets/data/report-entities.json')
        .pipe(
          map((data) => data.map((item) => new NameValueOption(item))),
          shareReplay(1)
        );
    }
    return this.reportCategoriesCache$;
  }

  getReportTypes(): Observable<Array<ReportType>> {
    if (!this.reportTypesCache$) {
      this.reportTypesCache$ = this.http
        .get<Array<ReportType>>('assets/data/report-types.json')
        .pipe(
          map((data) => data.map((item) => new ReportType(item))),
          shareReplay(1)
        );
    }
    return this.reportTypesCache$;
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
        map((response: any) => {
          // Backend returns { data, metadata }; CustomResponse expects payload
          const payload = response?.data ?? response?.payload ?? {};
          return new CustomResponse(
            { ...response, payload },
            (data) =>
              this.reportDataMapperService.mapReportsData(reportTypes, data)
          );
        })
      );
  }
}
