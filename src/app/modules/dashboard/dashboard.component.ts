import { Component } from '@angular/core';
import { CustomResponse } from 'src/app/shared/models/response.model';
import { ReportsService } from 'src/app/shared/services/reports.service';
import { DashboardStatsModel } from './model/dashboard.model';

@Component({
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  dashboardStats!: DashboardStatsModel;
  isLoading = false;
  dashboardStatusProperties = 7;

  constructor(private reportService: ReportsService) {}

  ngOnInit() {
    this.getDashboardStats();
  }

  getDashboardStats(): void {
    this.isLoading = true;
    this.reportService.getDashboardStats().subscribe(
      (response: CustomResponse<DashboardStatsModel>) => {
        this.dashboardStats = response?.payload ?? {};
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        console.log(error);
      }
    );
  }
}
