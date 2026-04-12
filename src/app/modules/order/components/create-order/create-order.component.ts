import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { requireNonEmptyArray } from '../../validators/order.validators';
import { flatMap, sumBy } from 'lodash-es';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';
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
  TabCloseEvent,
} from '../../interfaces/order-product.interface';
import { OrderProduct } from '../../models/order-product.model';
import { ProductOrderProduct } from '../../types/order-product.type';
import { INameValue } from 'src/app/shared/interfaces/name-value.interface';
import { OrderSourceService } from 'src/app/modules/order-source/services/order-source.service';
import { OrderSource } from 'src/app/modules/order-source/models/order-source.model';
import { CustomResponse } from 'src/app/shared/models/response.model';
import { TitleCasePipe } from '@angular/common';
import { City, Country } from 'src/app/shared/models';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DropdownModule } from 'primeng/dropdown';
import { DatePickerModule } from 'primeng/datepicker';
import { TabViewModule } from 'primeng/tabview';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { LoadingService } from 'src/app/core/services/loading.service';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TitleCasePipe,
    AutoCompleteModule,
    DropdownModule,
    DatePickerModule,
    TabViewModule,
    MultiSelectModule,
    ButtonModule,
    InputNumberModule,
    TableModule,
  ],
})
export class CreateOrderComponent implements OnInit {
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

  /** Map to store product details by product name — source of truth for product data in tabs */
  protected productDataMap = new Map<string, ProductOrderProduct>();

  selectedCustomer!: Customer;
  customerSuggestions = signal<Array<any>>([]);
  selectedProducts: Array<Product> = [];
  productSuggestions = signal<Array<Product>>([]);
  orderForm!: FormGroup;
  canShowProductDetailsTable = signal(false);
  paymentMethods: Array<INameValue> = [];
  orderTotalAmount = signal(0);
  maxDate: Date = new Date();
  orderSources = signal<Array<OrderSource>>([]);
  countries: Array<Country> = [];
  cities: Array<City> = [];

  /** Precomputed for template iteration to avoid method calls in @for. */
  orderProductsMap = signal<
    Array<{
      product: ProductOrderProduct;
      formGroup: FormGroup;
      rows: FormArray;
      rowGroups: FormGroup[];
    }>
  >([]);

  ngOnInit(): void {
    this.getOrderSources();
    this.buildOrderForm();
    this.buildPaymentMethodOptions();
  }

  buildOrderForm(): void {
    this.orderForm = this.formBuilder.group({
      selectedCustomer: ['', [Validators.required]],
      selectedProducts: [[], [requireNonEmptyArray]],
      description: ['', [Validators.required]],
      paymentMethod: [
        {
          value: 'easypaisa',
        },
        [Validators.required],
      ],
      orderDate: [new Date(), [Validators.required]],
      orderProducts: this.formBuilder.group({}),
      selectedOrderSources: ['', [Validators.required]],
    });
  }

  get selectedCustomerControl() {
    return this.orderForm.get('selectedCustomer') as FormControl;
  }

  get selectedProductsControl() {
    return this.orderForm.get('selectedProducts') as FormControl;
  }

  get orderProductsFormGroup(): FormGroup {
    return this.orderForm.get('orderProducts') as FormGroup;
  }

  getOrderProductFormGroup(productName: string): FormGroup {
    return this.orderForm.get('orderProducts')?.get(productName) as FormGroup;
  }

  getOrderProductRows(productName: string): FormArray {
    return this.orderForm
      .get('orderProducts')
      ?.get(productName)
      ?.get('rows') as FormArray;
  }

  getOrderProductRowGroup(productName: string, rowIndex: number) {
    const form = this.orderForm
      .get('orderProducts')
      ?.get(productName)
      ?.get('rows') as FormArray;
    return form.controls[rowIndex] as FormGroup;
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

  searchCustomer(event: any): void {
    of(event)
      .pipe(
        debounceTime(500),
        map(
          (customerAutocompleteEvent: AutoCompleteCompleteEvent) =>
            customerAutocompleteEvent.query
        ),
        distinctUntilChanged(),
        switchMap((searchTerm: string) => this.searchForCustomers(searchTerm)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((customers: Array<Customer>) => {
        this.customerSuggestions.set(customers);
      });
  }

  searchForCustomers(searchTerm: string): Observable<Array<Customer>> {
    let queryParams = {
      searchTerm,
    };
    return this.customerService.searchCustomers(queryParams);
  }

  searchProducts(event: AutoCompleteCompleteEvent): void {
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

  initizalizeProductDetail(product: ProductOrderProduct, isEmptyRows = false) {
    this.orderProductsFormGroup.addControl(
      product?.name,
      this.newOrderProduct(product, isEmptyRows)
    );
    this.refreshOrderProductsMap();
  }

  newOrderProduct(
    product: ProductOrderProduct,
    isEmptyRows = false
  ): FormGroup {
    return this.formBuilder.group({
      price: [product.price ?? null, [Validators.required]],
      rows: this.formBuilder.array(
        isEmptyRows ? [] : [this.newOrderProductRow(product, {})],
        Validators.required
      ),
    });
  }

  newOrderProductRow(
    product: ProductOrderProduct,
    options: { isBlankRow?: boolean; quantity?: number } = {},
  ): FormGroup {
    const isBlank = options.isBlankRow ?? false;
    const customizeName = isBlank
      ? ''
      : (product as OrderProduct).customizeName ?? '';
    const color = isBlank ? '' : (product as OrderProduct).color ?? '';
    const quantity =
      options.quantity ??
      (isBlank ? 1 : (product as OrderProduct).quantity ?? 1);
    return this.formBuilder.group({
      productId: [product.id, [Validators.required]],
      color: color,
      customizeName: customizeName,
      name: product.name,
      cost: product.cost,
      weight: product.weight,
      quantity: [quantity, [Validators.required, Validators.min(1)]],
    });
  }

  searchForProducts(searchTerm: string): Observable<Array<Product>> {
    let queryParams = {
      searchTerm,
    };
    return this.productService.searchProducts(queryParams);
  }

  onProductSelect(event: AutoCompleteSelectEvent): void {
    const product = event.value as ProductOrderProduct;
    this.productDataMap.set(product?.name, product);
    this.initizalizeProductDetail(product);
    this.canShowProductDetailsTable.set(true);
  }

  addOrderProductRow(
    product: ProductOrderProduct,
    isNewBlankRow = false,
    explicitQuantity?: number,
  ): void {
    const productRows = this.getOrderProductRows(product.name);
    const quantity =
      explicitQuantity ??
      (isNewBlankRow ? 1 : (product as OrderProduct).quantity ?? 1);
    productRows.push(
      this.newOrderProductRow(product, {
        isBlankRow: isNewBlankRow,
        quantity,
      }),
    );
    this.calculateOrderTotalAmount();
    this.refreshOrderProductsMap();
  }

  calculateOrderTotalAmount(): void {
    let total = 0;
    const orderProductsRoot = this.orderForm.value.orderProducts ?? {};
    Object.keys(orderProductsRoot).forEach((productName: string) => {
      const bundle = orderProductsRoot[productName];
      const price = Number(bundle?.price) || 0;
      const rows = bundle?.rows ?? [];
      rows.forEach((row: { quantity?: number }) => {
        const q = Math.max(1, Math.floor(Number(row.quantity) || 1));
        total += price * q;
      });
    });
    this.orderTotalAmount.set(total);
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

  saveOrder(): void {
    this.createOrder();
  }

  buildPaymentMethodOptions(): void {
    this.paymentMethods = [
      {
        name: 'Cash On Delivery',
        value: 'cash_on_delivery',
      },
      {
        name: 'Easypaisa',
        value: 'easypaisa',
      },
      {
        name: 'Online Account',
        value: 'online_account',
      },
    ];
  }

  onProductClear(event: AutoCompleteUnselectEvent): void {
    const product = event.value as ProductOrderProduct;
    this.productDataMap.delete(product.name);
    this.removeProductFormGroup(product.name);
    this.calculateOrderTotalAmount();
    this.refreshOrderProductsMap();
  }

  onProductTabClose(tabCloseEvent: any) {
    const productToBeRemoved = this.selectedProductsControl.value[
      tabCloseEvent.index
    ] as OrderProduct;
    this.productDataMap.delete(productToBeRemoved.name);
    this.removeProductFormGroup(productToBeRemoved.name);
    this.selectedProductsControl.value.splice(tabCloseEvent.index, 1);
    this.selectedProductsControl.setValue(this.selectedProductsControl.value);
    this.calculateOrderTotalAmount();
    this.refreshOrderProductsMap();
  }

  buildCreateOrderPayload() {
    const orderItems = this.buildOrderProductsPayload();
    const totalUnits = orderItems.reduce(
      (sum, row) =>
        sum + Math.max(1, Math.floor(Number(row.quantity) || 1)),
      0,
    );
    return {
      description: this.orderForm.value.description,
      paymentMethod: this.orderForm.value.paymentMethod?.value,
      amount: this.orderTotalAmount(),
      customerId: this.orderForm.value.selectedCustomer?.id,
      totalProductQuantity: totalUnits,
      totalWeight: this.getTotalCountByProperty('weight').toString(),
      orderItems,
      orderDate: this.orderForm.value?.orderDate,
      orderSourceIds: this.orderForm.value.selectedOrderSources,
    };
  }

  onRemoveProductRow(rowIndex: number, productName: string): void {
    const orderProductRows = this.getOrderProductRows(productName);
    orderProductRows.removeAt(rowIndex);
    this.calculateOrderTotalAmount();
    this.refreshOrderProductsMap();
  }

  showToast(message: string, type = 'success') {
    this.messageService.add({
      severity: type,
      detail: message,
    });
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
          this.orderSources.set(
            this.mapOrderSourcesToNameValue(response?.payload ?? [])
          );
        },
        error: () => this.orderSources.set([]),
      });
  }

  private getTotalCountByProperty(propertyName: string): number {
    const orderProducts = flatMap(
      this.orderForm.value?.orderProducts,
      (value) => value.rows
    );
    const totalWeight = sumBy(orderProducts, (item) => {
      const raw = String(item[propertyName] ?? '').replace(/[^\d.]/g, '');
      const numericWeight = parseFloat(raw);
      const units = Math.max(1, Math.floor(Number(item.quantity) || 1));
      const perUnit = isNaN(numericWeight) ? 0 : numericWeight;
      return perUnit * units;
    });
    return totalWeight;
  }

  private buildOrderProductsPayload() {
    const orderItems = flatMap(
      this.orderForm.value?.orderProducts,
      (value) => value.rows
    );
    return orderItems.map((product: OrderProductRecordTuple) => {
      return {
        productId: product.productId,
        cost: product.cost,
        color: product.color,
        price: this.orderForm.value.orderProducts[product.name].price,
        customizeName: product.customizeName,
        quantity: product.quantity,
      };
    });
  }

  protected removeProductFormGroup(productName: string): void {
    const orderProductFormGroup = this.orderForm.get(
      'orderProducts'
    ) as FormGroup;
    orderProductFormGroup.removeControl(productName);
  }

  private mapOrderSourcesToNameValue(
    orderSources: Array<OrderSource>
  ): Array<OrderSource> {
    let mappedOrderSources: Array<any> = [];
    if (orderSources?.length) {
      mappedOrderSources = orderSources.map((orderSource: OrderSource) => {
        orderSource.name = `${
          orderSource?.name
        } - ${this.titleCasePipe.transform(orderSource?.type)}`;
        return orderSource;
      });
    }
    return mappedOrderSources;
  }
}
