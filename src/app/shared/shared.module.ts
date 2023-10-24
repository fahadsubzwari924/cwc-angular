import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from './services/api.service';
import { SimpleModalModule } from 'ngx-simple-modal';
import { MarkFeildRequired } from './directives/requred-field-asterisk';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [MarkFeildRequired, ConfirmationModalComponent],
  imports: [CommonModule, SimpleModalModule, ButtonModule],
  providers: [ApiService],
  exports: [SimpleModalModule, MarkFeildRequired, ConfirmationModalComponent],
})
export class SharedModule {}
