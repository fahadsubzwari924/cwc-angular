import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from 'src/app/modules/product/models/product.model';

@Component({
  selector: 'cwc-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent {
  @Input() product!: Product;

  @Output() edit = new EventEmitter<Product>();
  @Output() delete = new EventEmitter<Product>();

  onEdit() {
    this.edit.emit(this.product);
  }

  onDelete() {
    this.delete.emit(this.product);
  }
}
