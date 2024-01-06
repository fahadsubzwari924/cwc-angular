import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, map } from 'rxjs';
import { CustomResponse } from '../models/response.model';
import { ApiPaths } from '../enums/api-paths';
import { DashboardStatsModel } from 'src/app/modules/dashboard/model/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(private apiService: ApiService) { }

  getDashboardStats(): Observable<CustomResponse<DashboardStatsModel>> {
    return this.apiService.httpGet(ApiPaths.DashboardStats).pipe(
      map((response: any) => new CustomResponse(response, (data) => new DashboardStatsModel(data)))
    )
  }

}
