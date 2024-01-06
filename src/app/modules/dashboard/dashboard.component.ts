import { Component } from '@angular/core';
import { CustomResponse } from 'src/app/shared/models/response.model';
import { ReportsService } from 'src/app/shared/services/reports.service';
import { DashboardStatsModel } from './model/dashboard.model';

@Component({
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {

  dashboardStats!: DashboardStatsModel;

  constructor(private reportService: ReportsService) {
  }

  ngOnInit() {
    this.getDashboardStats();
  }

  getDashboardStats(): void {
    this.reportService.getDashboardStats()
    .subscribe((response: CustomResponse<DashboardStatsModel>) => {
      this.dashboardStats = response?.payload ?? {};
    })
  }
}
