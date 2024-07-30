import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product-api.service';
import { SelectItem } from 'primeng/api';
import { DataView } from 'primeng/dataview';
import { SimpleModalService } from 'ngx-simple-modal';
import { CreateComponent } from '../create/create.component';
import { ConfirmationModalComponent } from 'src/app/shared/components/confirmation-modal/confirmation-modal.component';
import { MessageService } from 'primeng/api';
import { of, switchMap, tap } from 'rxjs';
import { EditProductComponent } from '../edit/edit-product.component';
import { CustomResponse } from 'src/app/shared/models/response.model';
import { PaginationConstants } from 'src/app/shared/constants/pagination.constants';
import { UtilService } from 'src/app/util/util.service';
import { ListConstants } from 'src/app/constants/list-constants';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  constructor(
    private productService: ProductService,
    private modalService: SimpleModalService,
    private messageService: MessageService,
    public paginationConstants: PaginationConstants,
    private utilService: UtilService
  ) {}

  products: Array<Product> = [];
  productResponseMetadata: any;
  sortOptions: SelectItem[] = [];
  sortOrder!: string;
  sortField: string = '';
  isLoading = false;
  startingRow = 0;

  ngOnInit(): void {
    this.startingRow = this.paginationConstants.FIRST_ROW;
    this.buildSortOptions();
    this.getProducts();
  }

  getProducts(params = {}): void {
    params = {
      ...params,
      pageSize: this.paginationConstants.PRODUCT_LIST_PAGE_LIMIT,
    };
    this.isLoading = true;
    this.productService.getProducts(params).subscribe(
      (response: CustomResponse<Product[]>) => {
        this.products = response?.payload;
        this.productResponseMetadata = response.metadata;
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
      }
    );
  }

  onSortChange(event: any) {
    const value = event.value;
    this.getSortFieldAndOrde(value);
    const queryParams = {
      sortBy: this.sortField,
      sortOrder: this.sortOrder,
    };
    this.getProducts(queryParams);
  }

  onFilter(dv: DataView, event: Event) {
    dv.filter((event.target as HTMLInputElement).value);
  }

  openCreateProductModal(): void {
    const inputs = {
      title: 'Create Product',
    };
    this.modalService
      .addModal(CreateComponent, inputs)
      .subscribe((isConfirmed) => {
        if (isConfirmed) {
          this.getProducts();
        }
      });
  }

  openEditProductModal(product: Product): void {
    const inputs = {
      title: 'Edit Product',
      product,
    };
    this.modalService
      .addModal(EditProductComponent, inputs)
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
              switchMap(() => of(this.getProducts()))
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
    this.startingRow = paginationEvent?.first ?? 0;
    this.utilService.setValueInLocalStorage(
      ListConstants.CURRENT_ROWS,
      this.startingRow
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
      this.sortOrder = 'desc';
      this.sortField = value.substring(1, value.length);
    } else {
      this.sortOrder = 'asc';
      this.sortField = value;
    }
  }
}
