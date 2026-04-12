import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product-api.service';
import { SelectItem } from 'primeng/api';
import { DataView } from 'primeng/dataview';
import { ModalService } from 'src/app/shared/services/modal.service';
import { CreateComponent } from '../create/create.component';
import { ConfirmationModalComponent } from 'src/app/shared/components/confirmation-modal/confirmation-modal.component';
import { MessageService } from 'primeng/api';
import {
  Observable,
  debounceTime,
  distinctUntilChanged,
  map,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { EditProductComponent } from '../edit/edit-product.component';
import { CustomResponse } from 'src/app/shared/models/response.model';
import { PaginationConstants } from 'src/app/shared/constants/pagination.constants';
import { UtilService } from 'src/app/util/util.service';
import { ListConstants } from 'src/app/constants/list-constants';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteSelectEvent,
} from 'src/app/modules/order/interfaces/order-product.interface';
import { ListSortOrder } from 'src/app/shared/enums/sort-order.enum';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { SkeletonModule } from 'primeng/skeleton';
import { BlockUIModule } from 'primeng/blockui';
import { ToastModule } from 'primeng/toast';
import { PaginatorModule } from 'primeng/paginator';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ProductCardComponent } from 'src/app/shared/components/product-card/product-card.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormsModule,
    ButtonModule,
    DataViewModule,
    SkeletonModule,
    BlockUIModule,
    ToastModule,
    PaginatorModule,
    AutoCompleteModule,
    InputTextModule,
    DropdownModule,
    ProductCardComponent,
  ],
})
export class ListComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly modalService = inject(ModalService);
  private readonly messageService = inject(MessageService);
  private readonly utilService = inject(UtilService);
  private readonly destroyRef = inject(DestroyRef);
  readonly paginationConstants = inject(PaginationConstants);

  products = signal<Array<Product>>([]);
  productResponseMetadata = signal<any>(null);
  sortOptions: SelectItem[] = [];
  sortOrder!: string;
  sortField = signal('');
  isLoading = signal(false);
  startingRow = signal(0);
  productSuggestions = signal<Array<Product>>([]);

  ngOnInit(): void {
    this.startingRow.set(this.paginationConstants.FIRST_ROW);
    this.buildSortOptions();
    this.getProducts();
  }

  getProducts(params = {}): void {
    params = {
      ...params,
      pageSize: this.paginationConstants.PRODUCT_LIST_PAGE_LIMIT,
    };
    this.isLoading.set(true);
    this.productService
      .getProducts(params)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: CustomResponse<Product[]>) => {
          this.products.set(response?.payload ?? []);
          this.productResponseMetadata.set(response.metadata);
          this.isLoading.set(false);
        },
        error: () => this.isLoading.set(false),
      });
  }

  onSortChange(event: any) {
    const value = event.value;
    this.getSortFieldAndOrde(value);
    const queryParams = {
      sortBy: this.sortField(),
      sortOrder: this.sortOrder,
    };
    this.getProducts(queryParams);
  }

  onFilter(dv: DataView, event: Event) {
    dv.filter((event.target as HTMLInputElement).value);
  }

  openCreateProductModal(): void {
    this.modalService
      .open(CreateComponent, { title: 'Create Product' }, { header: 'Create Product', width: '42rem' })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((isConfirmed) => {
        if (isConfirmed) this.getProducts();
      });
  }

  openEditProductModal(product: Product): void {
    this.modalService
      .open(EditProductComponent, { title: 'Edit Product', product }, { header: 'Edit Product', width: '42rem' })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((isConfirmed) => {
        if (isConfirmed) this.getProducts();
      });
  }

  onDelete(product: Product): void {
    const description = `Are you sure you want to delete this product with name "${product.name}"?`;
    const toastMessage = 'Product deleted!';
    this.modalService
      .open(ConfirmationModalComponent, {
        modalTitle: 'Delete Product',
        modalDescription: description,
      }, { header: 'Delete Product' })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((isConfirmed) => {
        if (isConfirmed) {
          this.productService
            .deleteProduct(product.id as number)
            .pipe(
              tap(() => this.showToast(toastMessage)),
              switchMap(() => of(this.getProducts())),
              takeUntilDestroyed(this.destroyRef)
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
      { label: 'Cost High to Low', value: '!cost' },
      { label: 'Cost Low to High', value: 'cost' },
    ];
  }

  onPageChange(paginationEvent: any): void {
    this.startingRow.set(paginationEvent?.first ?? 0);
    this.utilService.setValueInLocalStorage(
      ListConstants.CURRENT_ROWS,
      this.startingRow()
    );
    this.utilService.setValueInLocalStorage(
      ListConstants.CURRENT_PAGE,
      paginationEvent?.page + 1
    );
    const queryParams = {
      page: paginationEvent?.page + 1,
    };
    this.getProducts(queryParams);
  }

  private getSortFieldAndOrde(value: string): void {
    if (value.indexOf('!') === 0) {
      this.sortOrder = ListSortOrder.DESCENDING;
      this.sortField.set(value.substring(1, value.length));
    } else {
      this.sortOrder = ListSortOrder.ASCENDING;
      this.sortField.set(value);
    }
  }

  searchProduct(event: any): void {
    of(event)
      .pipe(
        debounceTime(500),
        map(
          (productAutocompleteEvent: AutoCompleteCompleteEvent) =>
            productAutocompleteEvent.query
        ),
        distinctUntilChanged(),
        switchMap((searchTerm: string) => this.searchForProducts(searchTerm)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((products: Array<Product>) => {
        this.productSuggestions.set(products);
      });
  }

  getSelectedProduct(event: AutoCompleteSelectEvent): void {
    const selected = event.value as Product;
    const queryParams = {
      filters: JSON.stringify({ name: selected?.name }),
    };
    this.getProducts(queryParams);
  }

  searchForProducts(searchTerm: string): Observable<Array<Product>> {
    let queryParams = {
      searchTerm,
    };
    return this.productService.searchProducts(queryParams);
  }

  onProductUnSelect(): void {
    this.getProducts();
  }
}
