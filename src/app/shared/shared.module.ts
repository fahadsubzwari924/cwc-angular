import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ApiService } from './services/api.service';
import { SimpleModalModule } from 'ngx-simple-modal';
import { MarkFeildRequired } from './directives/requred-field-asterisk';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import { ButtonModule } from 'primeng/button';
import { FieldPipe } from './pipes/show-nested-field.pipe';
import { CountryCityService } from './services/country-city.service';

@NgModule({
  declarations: [MarkFeildRequired, ConfirmationModalComponent, FieldPipe],
  imports: [CommonModule, SimpleModalModule, ButtonModule],
  providers: [ApiService, DatePipe, CurrencyPipe, CountryCityService],
  exports: [
    SimpleModalModule,
    MarkFeildRequired,
    ConfirmationModalComponent,
    FieldPipe,
  ],
})
export class SharedModule {}
