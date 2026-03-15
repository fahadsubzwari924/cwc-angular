import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TitleCasePipe } from '@angular/common';
import { flatMap, sumBy } from 'lodash-es';
import { debounceTime, distinctUntilChanged, map, Observable, of, switchMap } from 'rxjs';
import { Customer } from 'src/app/modules/customers/models/customer.model';
import { CustomerService } from 'src/app/modules/customers/services/customer.service';
import { Product } from 'src/app/modules/product/models/product.model';
import { ProductService } from 'src/app/modules/product/services/product-api.service';
import { OrderService } from '../../services/order.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteSelectEvent,
  AutoCompleteUnselectEvent,
  OrderProductRecordTuple,
} from '../../interfaces/order-product.interface';
import { OrderProduct } from '../../models/order-product.model';
import { ProductOrderProduct } from '../../types/order-product.type';
import { INameValue } from 'src/app/shared/interfaces/name-value.interface';
import { OrderSourceService } from 'src/app/modules/order-source/services/order-source.service';
import { OrderSource } from 'src/app/modules/order-source/models/order-source.model';
import { CustomResponse } from 'src/app/shared/models/response.model';
import { requireNonEmptyArray } from '../../validators/order.validators';

import { LoadingService } from 'src/app/core/services/loading.service';

import { OrderInfoFormComponent } from './components/order-info-form/order-info-form.component';
import { ProductSearchComponent } from './components/product-search/product-search.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { OrderSummaryComponent } from './components/order-summary/order-summary.component';

@Component({
  selector: 'app-create-order-v2',
  templateUrl: './create-order-v2.component.html',
  styleUrls: ['./create-order-v2.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TitleCasePipe,
    OrderInfoFormComponent,
    ProductSearchComponent,
    ProductCardComponent,
    OrderSummaryComponent,
  ],
})
export class CreateOrderV2Component implements OnInit {
  protected readonly customerService = inject(CustomerService);
  protected readonly productService = inject(ProductService);
  protected readonly formBuilder = inject(FormBuilder);
  protected readonly orderService = inject(OrderService);
  protected readonly messageService = inject(MessageService);
  protected readonly router = inject(Router);
  protected readonly orderSourceService = inject(OrderSourceService);
  protected readonly titleCasePipe = inject(TitleCasePipe);
  protected readonly destroyRef = inject(DestroyRef);
  protected readonly loadingService = inject(LoadingService);

  protected productDataMap = new Map<string, ProductOrderProduct>();

  customerSuggestions = signal<Array<any>>([]);
  productSuggestions = signal<Array<Product>>([]);
  orderForm!: FormGroup;
  canShowProductDetailsTable = signal(false);
  paymentMethods: Array<INameValue> = [];
  orderTotalAmount = signal(0);
  maxDate: Date = new Date();
  orderSources = signal<Array<OrderSource>>([]);

  orderProductsMap = signal<
    Array<{
      product: ProductOrderProduct;
      formGroup: FormGroup;
      rows: FormArray;
      rowGroups: FormGroup[];
    }>
  >([]);

  /** Keeps summary Save button in sync with form validity under OnPush. */
  formInvalid = signal(true);

  ngOnInit(): void {
    this.getOrderSources();
    this.buildOrderForm();
    this.buildPaymentMethodOptions();
    this.orderForm.statusChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.formInvalid.set(this.orderForm.invalid));
    this.formInvalid.set(this.orderForm.invalid);
  }

  buildOrderForm(): void {
    this.orderForm = this.formBuilder.group({
      selectedCustomer: ['', [Validators.required]],
      selectedProducts: [[], [requireNonEmptyArray]],
      description: ['', [Validators.required]],
      paymentMethod: [{ value: 'easypaisa' }, [Validators.required]],
      orderDate: [new Date(), [Validators.required]],
      orderProducts: this.formBuilder.group({}),
      selectedOrderSources: ['', [Validators.required]],
    });
  }

  get selectedCustomerControl(): FormControl {
    return this.orderForm.get('selectedCustomer') as FormControl;
  }

  get selectedProductsControl(): FormControl {
    return this.orderForm.get('selectedProducts') as FormControl;
  }

  get orderProductsFormGroup(): FormGroup {
    return this.orderForm.get('orderProducts') as FormGroup;
  }

  getOrderProductFormGroup(productName: string): FormGroup {
    return this.orderForm.get('orderProducts')?.get(productName) as FormGroup;
  }

  getOrderProductRows(productName: string): FormArray {
    return this.orderForm.get('orderProducts')?.get(productName)?.get('rows') as FormArray;
  }

  refreshOrderProductsMap(): void {
    const orderProducts = this.orderForm.get('orderProducts') as FormGroup;
    const productNames = Object.keys(orderProducts?.controls ?? {});
    const map = productNames
      .map((productName) => {
        const product = this.productDataMap.get(productName);
        if (!product) return null;
        const formGroup = this.getOrderProductFormGroup(productName);
        const rows = this.getOrderProductRows(productName);
        const rowGroups = (rows?.controls ?? []) as FormGroup[];
        return { product, formGroup, rows, rowGroups };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
    this.orderProductsMap.set(map);
  }

  searchCustomer(event: AutoCompleteCompleteEvent): void {
    of(event)
      .pipe(
        debounceTime(500),
        map((e) => e.query),
        distinctUntilChanged(),
        switchMap((searchTerm: string) => this.searchForCustomers(searchTerm)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((customers: Array<Customer>) => {
        this.customerSuggestions.set(customers);
      });
  }

  searchForCustomers(searchTerm: string): Observable<Array<Customer>> {
    return this.customerService.searchCustomers({ searchTerm });
  }

  searchProducts(event: AutoCompleteCompleteEvent): void {
    of(event)
      .pipe(
        debounceTime(500),
        map((e) => e.query),
        distinctUntilChanged(),
        switchMap((searchTerm: string) => this.searchForProducts(searchTerm)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((products: Array<Product>) => {
        this.productSuggestions.set(products);
      });
  }

  initizalizeProductDetail(product: ProductOrderProduct, isEmptyRows = false): void {
    this.orderProductsFormGroup.addControl(
      product?.name,
      this.newOrderProduct(product, isEmptyRows)
    );
    this.refreshOrderProductsMap();
  }

  newOrderProduct(product: ProductOrderProduct, isEmptyRows = false): FormGroup {
    return this.formBuilder.group({
      price: [product.price ?? null, [Validators.required]],
      rows: this.formBuilder.array(
        isEmptyRows ? [] : [this.newOrderProductRow(product)],
        Validators.required
      ),
    });
  }

  newOrderProductRow(product: ProductOrderProduct, isNew = false): FormGroup {
    const customizeName = isNew ? '' : (product as OrderProduct).customizeName ?? '';
    const color = isNew ? '' : (product as OrderProduct).color ?? '';
    const quantity = this.getOrderProductQuantity(product.name, isNew);
    return this.formBuilder.group({
      productId: [product.id, [Validators.required]],
      color,
      customizeName,
      name: product.name,
      cost: product.cost,
      weight: product.weight,
      quantity,
    });
  }

  searchForProducts(searchTerm: string): Observable<Array<Product>> {
    return this.productService.searchProducts({ searchTerm });
  }

  onProductSelect(event: AutoCompleteSelectEvent): void {
    const product = event.value as ProductOrderProduct;
    this.productDataMap.set(product?.name, product);
    this.initizalizeProductDetail(product);
    this.canShowProductDetailsTable.set(true);
  }

  onProductClear(event: AutoCompleteUnselectEvent): void {
    const product = event.value as ProductOrderProduct;
    this.productDataMap.delete(product.name);
    this.removeProductFormGroup(product.name);
    const current: ProductOrderProduct[] = this.selectedProductsControl.value ?? [];
    this.selectedProductsControl.setValue(current.filter((p) => p.name !== product.name));
    this.calculateOrderTotalAmount();
    this.refreshOrderProductsMap();
  }

  removeProductCard(product: ProductOrderProduct): void {
    this.productDataMap.delete(product.name);
    this.removeProductFormGroup(product.name);
    const current: ProductOrderProduct[] = this.selectedProductsControl.value ?? [];
    this.selectedProductsControl.setValue(current.filter((p) => p.name !== product.name));
    this.calculateOrderTotalAmount();
    this.refreshOrderProductsMap();
  }

  addOrderProductRow(product: ProductOrderProduct, isNew = false): void {
    const productRows = this.getOrderProductRows(product.name);
    productRows.push(this.newOrderProductRow(product, isNew));
    this.incrementProductQuantityCount(product.name);
    this.calculateOrderTotalAmount();
    this.refreshOrderProductsMap();
  }

  onRemoveProductRow(rowIndex: number, productName: string): void {
    const orderProductRows = this.getOrderProductRows(productName);
    orderProductRows.removeAt(rowIndex);
    this.decrementProductQuantityCount(productName);
    this.calculateOrderTotalAmount();
    this.refreshOrderProductsMap();
  }

  calculateOrderTotalAmount(): void {
    let total = 0;
    Object.keys(this.orderForm.value.orderProducts).forEach((productName: string) => {
      const orderProducts = this.orderForm.value.orderProducts[productName];
      const orderProductQuantity = orderProducts.rows?.length;
      if (orderProducts?.price > 0) {
        total += orderProducts?.price * orderProductQuantity;
      }
    });
    this.orderTotalAmount.set(total);
  }

  getLineTotal(item: { formGroup: FormGroup; rowGroups: FormGroup[] }): number {
    const price = item.formGroup?.get('price')?.value ?? 0;
    return price * item.rowGroups.length;
  }

  saveOrder(): void {
    this.createOrder();
  }

  createOrder(): void {
    this.loadingService.show('Saving order...');
    const createOrderPayload = this.buildCreateOrderPayload();
    this.orderService
      .createOrder(createOrderPayload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loadingService.hide();
          this.showToast('Order created!');
          this.router.navigate(['/orders']);
        },
        error: () => this.loadingService.hide(),
      });
  }

  buildPaymentMethodOptions(): void {
    this.paymentMethods = [
      { name: 'Cash On Delivery', value: 'cash_on_delivery' },
      { name: 'Easypaisa', value: 'easypaisa' },
      { name: 'Online Account', value: 'online_account' },
    ];
  }

  buildCreateOrderPayload(): object {
    return {
      description: this.orderForm.value.description,
      paymentMethod: this.orderForm.value.paymentMethod?.value,
      amount: this.orderTotalAmount(),
      customerId: this.orderForm.value.selectedCustomer?.id,
      totalProductQuantity: this.buildOrderProductsPayload()?.length,
      totalWeight: this.getTotalCountByProperty('weight').toString(),
      orderItems: this.buildOrderProductsPayload(),
      orderDate: this.orderForm.value?.orderDate,
      orderSourceIds: this.orderForm.value.selectedOrderSources,
    };
  }

  showToast(message: string, type = 'success'): void {
    this.messageService.add({ severity: type, detail: message });
  }

  onCancel(): void {
    this.router.navigate(['/orders']);
  }

  getOrderSources(): void {
    this.orderSourceService
      .getOrderSources()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: CustomResponse<OrderSource[]>) => {
          this.orderSources.set(this.mapOrderSourcesToNameValue(response?.payload ?? []));
        },
        error: () => this.orderSources.set([]),
      });
  }

  protected removeProductFormGroup(productName: string): void {
    const orderProductFormGroup = this.orderForm.get('orderProducts') as FormGroup;
    orderProductFormGroup.removeControl(productName);
  }

  private getTotalCountByProperty(propertyName: string): number {
    const orderProducts = flatMap(this.orderForm.value?.orderProducts, (value) => value.rows);
    return sumBy(orderProducts, (item) => {
      const numericWeight = parseFloat(String(item[propertyName]).replace(/[^\d.]/g, ''));
      return isNaN(numericWeight) ? 0 : numericWeight;
    });
  }

  private buildOrderProductsPayload(): object[] {
    const orderItems = flatMap(this.orderForm.value?.orderProducts, (value) => value.rows);
    return orderItems.map((product: OrderProductRecordTuple) => ({
      productId: product.productId,
      cost: product.cost,
      color: product.color,
      price: this.orderForm.value.orderProducts[product.name].price,
      customizeName: product.customizeName,
      quantity: product.quantity,
    }));
  }

  private incrementProductQuantityCount(productName: string): void {
    const orderProductRows = this.getOrderProductRows(productName);
    const incremented =
      Number(orderProductRows.controls[0]?.get('quantity')?.value) + 1;
    for (let i = 0; i < orderProductRows.length; i++) {
      orderProductRows.controls[i].get('quantity')?.setValue(incremented);
    }
  }

  private decrementProductQuantityCount(productName: string): void {
    const orderProductRows = this.getOrderProductRows(productName);
    let qty = this.getOrderProductQuantity(productName);
    qty = qty > 0 ? qty - 1 : 0;
    for (let i = 0; i < orderProductRows.length; i++) {
      orderProductRows.controls[i].get('quantity')?.setValue(qty);
    }
  }

  private getOrderProductQuantity(productName: string, isNew = false): number {
    const orderProductRows = this.getOrderProductRows(productName);
    return isNew ? orderProductRows.length + 1 : orderProductRows?.length ?? 1;
  }

  private mapOrderSourcesToNameValue(orderSources: Array<OrderSource>): Array<OrderSource> {
    if (!orderSources?.length) return [];
    return orderSources.map((orderSource: OrderSource) => {
      orderSource.name = `${orderSource?.name} - ${this.titleCasePipe.transform(orderSource?.type)}`;
      return orderSource;
    });
  }
}
