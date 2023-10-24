import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product-api.service';
import { SelectItem } from 'primeng/api';
import { DataView } from 'primeng/dataview';
import { SimpleModalService } from 'ngx-simple-modal';
import { CreateComponent } from '../create/create.component';
import { eCRUDActions } from 'src/app/shared/enums/crud-actions.enum';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  constructor(
    private productService: ProductService,
    private modalService: SimpleModalService
  ) {}

  products: Array<Product> = [];
  sortOptions: SelectItem[] = [];
  sortOrder: number = 0;
  sortField: string = '';

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.productService.getProducts().subscribe((products: Array<Product>) => {
      this.products = products;
    });
    this.sortOptions = [
      { label: 'Price High to Low', value: '!price' },
      { label: 'Price Low to High', value: 'price' },
    ];
  }

  onSortChange(event: any) {
    const value = event.value;

    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    } else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }

  onFilter(dv: DataView, event: Event) {
    dv.filter((event.target as HTMLInputElement).value);
  }

  openCreateProductModal() {
    this.openProductModal('Create Product', eCRUDActions.ADD);
  }

  openEditProductModal(product: Product) {
    this.openProductModal('Update Product', eCRUDActions.EDIT, product);
  }
  openProductModal(title: string, action: string, product?: Product): void {
    const modalRef = this.modalService
      .addModal(CreateComponent, {
        title,
        action,
        product
      })
      .subscribe((isConfirmed) => {
        console.log(isConfirmed);
        this.getProducts();
      });
  }
}
