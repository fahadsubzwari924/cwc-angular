import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from './services/api.service';
import { SimpleModalModule } from 'ngx-simple-modal';
import { MarkFeildRequired } from './directives/requred-field-asterisk';

@NgModule({
  declarations: [MarkFeildRequired],
  imports: [CommonModule, SimpleModalModule],
  providers: [ApiService],
  exports: [SimpleModalModule, MarkFeildRequired],
})
export class SharedModule {}
