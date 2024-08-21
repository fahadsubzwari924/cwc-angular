import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { flatMap, sumBy } from 'lodash';
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
import { ProgressSpinner } from 'primeng/progressspinner';
import {
  AutoCompleteCompleteEvent,
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

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.scss'],
})
export class CreateOrderComponent implements OnInit {
  selectedCustomer!: Customer;
  customerSuggestions: Array<any> = [];

  selectedProducts: Array<Product> = [];
  productSuggestions: Array<Product> = [];

  orderForm!: FormGroup;
  canShowProductDetailsTable = false;
  paymentMethods: Array<INameValue> = [];
  orderTotalAmount: number = 0;

  spinner!: ProgressSpinner;
  showSpinner = false;

  maxDate: Date = new Date();
  orderSources: Array<OrderSource> = [];
  countries: Array<Country> = [];
  cities: Array<City> = [];

  constructor(
    protected customerService: CustomerService,
    protected productService: ProductService,
    protected formBuilder: FormBuilder,
    protected orderService: OrderService,
    protected messageService: MessageService,
    protected router: Router,
    protected orderSourceService: OrderSourceService,
    protected titleCasePipe: TitleCasePipe
  ) {
    this.spinner = new ProgressSpinner();
  }

  ngOnInit(): void {
    this.getOrderSources();
    this.buildOrderForm();
    this.buildPaymentMethodOptions();
  }

  buildOrderForm(): void {
    this.orderForm = this.formBuilder.group({
      selectedCustomer: ['', [Validators.required]],
      selectedProducts: ['', [Validators.required]],
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

  searchCustomer(event: AutoCompleteCompleteEvent): void {
    of(event)
      .pipe(
        debounceTime(500),
        map(
          (customerAutocompleteEvent: AutoCompleteCompleteEvent) =>
            customerAutocompleteEvent.query
        ),
        distinctUntilChanged(),
        switchMap((searchTerm: string) => this.searchForCustomers(searchTerm))
      )
      .subscribe((customers: Array<Customer>) => {
        this.customerSuggestions = customers;
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
        switchMap((searchTerm: string) => this.searchForProducts(searchTerm))
      )
      .subscribe((products: Array<Product>) => {
        this.productSuggestions = products;
      });
  }

  initizalizeProductDetail(product: ProductOrderProduct, isEmptyRows = false) {
    this.orderProductsFormGroup.addControl(
      product?.name,
      this.newOrderProduct(product, isEmptyRows)
    );
  }

  newOrderProduct(
    product: ProductOrderProduct,
    isEmptyRows = false
  ): FormGroup {
    return this.formBuilder.group({
      price: [product.price ?? null, [Validators.required]],
      rows: this.formBuilder.array(
        isEmptyRows ? [] : [this.newOrderProductRow(product)],
        Validators.required
      ),
    });
  }

  newOrderProductRow(product: ProductOrderProduct, isNew = false): FormGroup {
    const customizeName = isNew
      ? ''
      : (product as OrderProduct).customizeName ?? '';
    const color = isNew ? '' : (product as OrderProduct).color ?? '';
    const quantity = this.getOrderProductQuantity(product.name, isNew);
    return this.formBuilder.group({
      productId: [product.id, [Validators.required]],
      color: color,
      customizeName: customizeName,
      name: product.name,
      cost: product.cost,
      weight: product.weight,
      quantity: quantity,
    });
  }

  searchForProducts(searchTerm: string): Observable<Array<Product>> {
    let queryParams = {
      searchTerm,
    };
    return this.productService.searchProducts(queryParams);
  }

  onProductSelect(selectedProduct: Product): void {
    this.initizalizeProductDetail(selectedProduct);
    this.canShowProductDetailsTable = true;
  }

  addOrderProductRow(product: ProductOrderProduct, isNew = false): void {
    const productRows = this.getOrderProductRows(product.name);
    productRows.push(this.newOrderProductRow(product, isNew));
    this.incrementProductQuantityCount(product.name);
    this.calculateOrderTotalAmount();
  }

  calculateOrderTotalAmount(): void {
    this.orderTotalAmount = 0;
    Object.keys(this.orderForm.value.orderProducts).forEach(
      (productName: string) => {
        const orderProducts = this.orderForm.value.orderProducts[productName];
        const orderProductQuantity = orderProducts.rows?.length;
        if (orderProducts?.price > 0) {
          this.orderTotalAmount += orderProducts?.price * orderProductQuantity;
        } else {
          this.orderTotalAmount = this.orderTotalAmount;
        }
      }
    );
  }

  createOrder(): void {
    this.showSpinner = true;
    const createOrderPayload = this.buildCreateOrderPayload();
    this.orderService.createOrder(createOrderPayload).subscribe((res) => {
      this.showSpinner = false;
      this.showToast('Order created!');
      this.router.navigate(['/orders']);
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

  onProductClear(orderProduct: OrderProduct) {
    this.removeProductFormGroup(orderProduct.name);
    this.calculateOrderTotalAmount();
  }

  onProductTabClose(tabCloseEvent: TabCloseEvent) {
    const productToBeRemoved = this.selectedProductsControl.value[
      tabCloseEvent.index
    ] as OrderProduct;
    this.removeProductFormGroup(productToBeRemoved.name);
    this.selectedProductsControl.value.splice(tabCloseEvent.index, 1);
    this.selectedProductsControl.setValue(this.selectedProductsControl.value);
    this.calculateOrderTotalAmount();
  }

  buildCreateOrderPayload() {
    return {
      description: this.orderForm.value.description,
      paymentMethod: this.orderForm.value.paymentMethod?.value,
      amount: this.orderTotalAmount,
      customerId: this.orderForm.value.selectedCustomer?.id,
      totalProductQuantity: this.buildOrderProductsPayload()?.length,
      totalWeight: this.getTotalCountByProperty('weight').toString(),
      orderItems: this.buildOrderProductsPayload(),
      orderDate: this.orderForm.value?.orderDate,
      orderSourceIds: this.orderForm.value.selectedOrderSources,
    };
  }

  onRemoveProductRow(rowIndex: number, productName: string): void {
    const orderProductRows = this.getOrderProductRows(productName);
    orderProductRows.removeAt(rowIndex);
    this.decrementProductQuantityCount(productName);
    this.calculateOrderTotalAmount();
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
    this.orderSourceService.getOrderSources().subscribe(
      (response: CustomResponse<OrderSource[]>) => {
        this.orderSources = this.mapOrderSourcesToNameValue(
          response?.payload ?? []
        );
      },
      (error) => {
        this.orderSources = [];
      }
    );
  }

  private getTotalCountByProperty(propertyName: string): number {
    const orderProducts = flatMap(
      this.orderForm.value?.orderProducts,
      (value) => value.rows
    );
    const totalWeight = sumBy(orderProducts, (item) => {
      const numericWeight = parseFloat(
        item[propertyName].replace(/[^\d.]/g, '')
      );
      return isNaN(numericWeight) ? 0 : numericWeight;
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

  private incrementProductQuantityCount(productName: string): void {
    const orderProductRows = this.getOrderProductRows(productName);
    const incrementedOrderProductQuantity =
      Number(orderProductRows.controls[0].get('quantity')?.value) + 1;
    for (let i = 0; i < orderProductRows.length; i++) {
      orderProductRows.controls[i]
        .get('quantity')
        ?.setValue(incrementedOrderProductQuantity);
    }
  }

  private decrementProductQuantityCount(productName: string): void {
    const orderProductRows = this.getOrderProductRows(productName);
    let decrementedOrderProductQuantity =
      this.getOrderProductQuantity(productName);
    decrementedOrderProductQuantity =
      decrementedOrderProductQuantity > 0
        ? decrementedOrderProductQuantity--
        : 0;
    for (let i = 0; i < orderProductRows.length; i++) {
      orderProductRows.controls[i]
        .get('quantity')
        ?.setValue(decrementedOrderProductQuantity);
    }
  }

  private removeProductFormGroup(productName: string): void {
    const orderProductFormGroup = this.orderForm.get(
      'orderProducts'
    ) as FormGroup;
    orderProductFormGroup.removeControl(productName);
  }

  private getOrderProductQuantity(productName: string, isNew = false): number {
    const orderProductRows = this.getOrderProductRows(productName);
    return isNew ? orderProductRows.length + 1 : orderProductRows?.length ?? 1;
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
