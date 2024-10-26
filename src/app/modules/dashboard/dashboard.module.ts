import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard.component';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { PanelMenuModule } from 'primeng/panelmenu';
import { DashboardsRoutingModule } from './dashboard-routing.module';
import { SkeletonModule } from 'primeng/skeleton';
import { SharedModule } from 'src/app/shared/shared.module';
import { ChartService } from '../reports/services/chart.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MenuModule,
    TableModule,
    StyleClassModule,
    PanelMenuModule,
    ButtonModule,
    DashboardsRoutingModule,
    SkeletonModule,
    SharedModule,
  ],
  declarations: [DashboardComponent],
  providers: [ChartService],
})
export class DashboardModule {}
