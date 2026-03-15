import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DropdownModule } from 'primeng/dropdown';
import { DatePickerModule } from 'primeng/datepicker';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputText } from 'primeng/inputtext';

import { AutoCompleteCompleteEvent } from '../../../../interfaces/order-product.interface';
import { OrderSource } from 'src/app/modules/order-source/models/order-source.model';
import { INameValue } from 'src/app/shared/interfaces/name-value.interface';

@Component({
  selector: 'app-order-info-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    AutoCompleteModule,
    DropdownModule,
    DatePickerModule,
    MultiSelectModule,
    InputText,
  ],
  templateUrl: './order-info-form.component.html',
  styleUrl: './order-info-form.component.scss',
})
export class OrderInfoFormComponent {
  formGroup = input.required<FormGroup>();
  orderSources = input.required<OrderSource[]>();
  paymentMethods = input.required<INameValue[]>();
  customerSuggestions = input<unknown[]>([]);
  maxDate = input<Date>();

  customerSearch = output<AutoCompleteCompleteEvent>();
}
