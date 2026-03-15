import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Product } from 'src/app/modules/product/models/product.model';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'cwc-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ButtonModule, TooltipModule],
})
export class ProductCardComponent {
  product = input.required<Product>();

  edit = output<Product>();
  delete = output<Product>();

  onEdit() {
    this.edit.emit(this.product());
  }

  onDelete() {
    this.delete.emit(this.product());
  }
}
