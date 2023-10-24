import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product-api.service';
import { SelectItem } from 'primeng/api';
import { DataView } from 'primeng/dataview';
import { SimpleModalService } from 'ngx-simple-modal';
import { CreateComponent } from '../create/create.component';
import { ConfirmationModalComponent } from 'src/app/shared/components/confirmation-modal/confirmation-modal.component';
import { MessageService } from 'primeng/api';
import { Observable, of, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  constructor(
    private productService: ProductService,
    private modalService: SimpleModalService,
    private messageService: MessageService
  ) {}

  products$!: Observable<Array<Product>>;
  sortOptions: SelectItem[] = [];
  sortOrder: number = 0;
  sortField: string = '';

  ngOnInit(): void {
    this.buildSortOptions();
    this.getProducts();
  }

  getProducts(): void {
    this.products$ = this.productService.getProducts();
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

  openCreateProductModal(): void {
    this.modalService
      .addModal(CreateComponent, {
        title: 'Create Product',
        message: 'Test Product',
      })
      .subscribe((isConfirmed) => {
        if (isConfirmed) {
          this.getProducts();
        }
      });
  }

  onDelete(product: Product): void {
    const description = `Are you sure you want to delete this product with name "${product.name}"?`;
    const toastMessage = 'Product deleted!';
    this.modalService
      .addModal(ConfirmationModalComponent, {
        modalTitle: 'Delete Product',
        modalDescription: description,
      })
      .subscribe((isConfirmed) => {
        if (isConfirmed) {
          this.productService
            .deleteProduct(product.id as number)
            .pipe(
              tap(() => this.showToast(toastMessage)),
              switchMap(() => of(this.getProducts))
            )
            .subscribe();
        }
      });
  }

  showToast(message: string) {
    this.messageService.add({
      severity: 'success',
      detail: message,
    });
  }

  buildSortOptions(): void {
    this.sortOptions = [
      { label: 'Price High to Low', value: '!price' },
      { label: 'Price Low to High', value: 'price' },
    ];
  }
}
