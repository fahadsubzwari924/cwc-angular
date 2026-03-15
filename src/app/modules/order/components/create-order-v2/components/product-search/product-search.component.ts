import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';

import { AutoCompleteCompleteEvent, AutoCompleteSelectEvent, AutoCompleteUnselectEvent } from '../../../../interfaces/order-product.interface';
import { Product } from 'src/app/modules/product/models/product.model';

@Component({
  selector: 'app-product-search',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, AutoCompleteModule],
  templateUrl: './product-search.component.html',
  styleUrl: './product-search.component.scss',
})
export class ProductSearchComponent {
  formGroup = input.required<FormGroup>();
  suggestions = input<Product[]>([]);

  productSearch = output<AutoCompleteCompleteEvent>();
  productSelected = output<AutoCompleteSelectEvent>();
  productDeselected = output<AutoCompleteUnselectEvent>();
}
