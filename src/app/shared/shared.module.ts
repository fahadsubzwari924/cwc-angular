import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ApiService } from './services/api.service';
import { SimpleModalModule } from 'ngx-simple-modal';
import { MarkFeildRequired } from './directives/requred-field-asterisk';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import { ButtonModule } from 'primeng/button';
import { FieldPipe } from './pipes/show-nested-field.pipe';
import { CountryCityService } from './services/country-city.service';
import { PieChartComponent } from './components/pie-chart/pie-chart.component';
import { BarGraphComponent } from './components/bar-graph/bar-graph.component';
import { ChartHostComponent } from './components/chart-host/chart-host.component';

@NgModule({
  declarations: [
    MarkFeildRequired,
    ConfirmationModalComponent,
    FieldPipe,
    PieChartComponent,
    BarGraphComponent,
    ChartHostComponent,
  ],
  imports: [CommonModule, SimpleModalModule, ButtonModule],
  providers: [ApiService, DatePipe, CurrencyPipe, CountryCityService],
  exports: [
    SimpleModalModule,
    MarkFeildRequired,
    ConfirmationModalComponent,
    FieldPipe,
    PieChartComponent,
    BarGraphComponent,
    ChartHostComponent,
  ],
})
export class SharedModule {}
