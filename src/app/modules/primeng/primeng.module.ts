import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// primeng imports
import { InputTextModule } from 'primeng/inputtext';
import { SidebarModule } from 'primeng/sidebar';
import { BadgeModule } from 'primeng/badge';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { DropdownModule } from 'primeng/dropdown';
import { DataViewModule } from 'primeng/dataview';
import { PickListModule } from 'primeng/picklist';
import { OrderListModule } from 'primeng/orderlist';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    InputTextModule,
    SidebarModule,
    BadgeModule,
    RadioButtonModule,
    InputSwitchModule,
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    FormsModule,
    PasswordModule,
    DataViewModule,
    PickListModule,
    OrderListModule,
    DropdownModule,
  ],
  exports: [
    InputTextModule,
    SidebarModule,
    BadgeModule,
    RadioButtonModule,
    InputSwitchModule,
    ButtonModule,
    CheckboxModule,
    FormsModule,
    PasswordModule,
    DataViewModule,
    PickListModule,
    OrderListModule,
    DropdownModule,
  ],
})
export class CustomPrimengModule {}
