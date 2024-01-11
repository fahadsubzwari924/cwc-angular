import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { flatMap, omit } from 'lodash';
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
  ProductDetail,
  AutoCompleteCompleteEvent,
  OrderProductRecordTuple,
  TabCloseEvent,
} from '../../interfaces/order-product.interface';
import { OrderProduct } from '../../models/order-product.model';

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

  productDetails: ProductDetail = {};

  orderForm!: FormGroup;
  canShowProductDetailsTable = false;
  paymentMethods: Array<{ name: string; value: string }> = [];
  orderTotalAmount: number = 0;

  spinner!: ProgressSpinner;
  showSpinner = false;
  maxDate: Date = new Date();

  constructor(
    protected customerService: CustomerService,
    protected productService: ProductService,
    protected formBuilder: FormBuilder,
    protected orderService: OrderService,
    protected messageService: MessageService,
    protected router: Router
  ) {
    this.spinner = new ProgressSpinner();
  }

  ngOnInit(): void {
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
      orderTotalAmount: [0, [Validators.required]],
      products: this.formBuilder.group({})
    });
  }

  get productsForm() {
    return this.orderForm.get('products') as FormGroup;
  }

  get selectedCustomerControl() {
    return this.orderForm.get('selectedCustomer') as FormControl;
  }

  get selectedProductsControl() {
    return this.orderForm.get('selectedProducts') as FormControl;
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

  searchForProducts(searchTerm: string): Observable<Array<Product>> {
    let queryParams = {
      searchTerm,
    };
    return this.productService.searchProducts(queryParams);
  }

  onProductSelect(selectedProduct: Product): void {
    const productControls = this.formBuilder.group({
      name: new FormControl(selectedProduct.name),
      quantity: new FormControl(1),
      price: new FormControl(0),
      orderProducts: this.formBuilder.array([]),
      weight: new FormControl(selectedProduct?.weight),
    });

    this.productsForm.addControl(selectedProduct.name, productControls);

    this.addOrderProductRow(selectedProduct);
    this.canShowProductDetailsTable = true;
  }

  onSelectProductQuantity(product: OrderProduct, productQuantity: number) {
    for (let i = 0; i < productQuantity; i++) {
      const form = this.formBuilder.group({
        id: new FormControl(product.id ?? 0),
        color: new FormControl(product.color ?? ''),
        customizeName: new FormControl(product.customizeName ?? ''),
        name: new FormControl(product.name),
        cost: new FormControl(product.cost),
        weight: new FormControl(product.weight),
        quantity: new FormControl(this.productsForm.value[product.name]?.quantity ?? 0),
      });

      (this.productsForm.get(product.name)?.get('orderProducts') as FormArray).push(form);

    }
    this.canShowProductDetailsTable = true;
  }

  addOrderProductRow(product: Product): void {
    const details = this.formBuilder.group({
      id: new FormControl(product.id ?? 0),
      color: new FormControl(''),
      customizeName: new FormControl(''),
      name: new FormControl(product?.name),
      cost: new FormControl(product?.cost),
      weight: new FormControl(product?.weight),
      quantity: new FormControl(this.productsForm.get(product.name)?.value.quantity ?? 0),
    });

    (this.productsForm.get(product.name)?.get('orderProducts') as FormArray).push(details);
    this.calculateOrderTotalAmount();
  }

  calculateOrderTotalAmount(): void {
    this.orderForm.get('orderTotalAmount')?.setValue(0);
    Object.keys(this.productsForm.value).forEach((productName: string) => {
      const orderProductQuantity =
      this.productsForm.value[productName]?.orderProducts?.length;
      if (this.productsForm.value[productName]?.price > 0) {
        const totalAmount = this.orderForm.value?.orderTotalAmount +
        this.productsForm.value[productName]?.price * orderProductQuantity;

        this.orderForm.get('orderTotalAmount')?.setValue(totalAmount);
      }
      // else {
      //   this.orderTotalAmount = this.orderTotalAmount;
      // }
    });
  }

  createOrder(): void {
    this.showSpinner = true;
    const createOrderPayload = this.buildCreateOrderPayload();
    console.log('createOrderPayload: ', createOrderPayload);
    return;
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
    this.productsForm.removeControl(orderProduct.name);
    this.calculateOrderTotalAmount();
  }

  onProductTabClose(tabCloseEvent: TabCloseEvent) {
    const productToBeRemoved = this.selectedProductsControl.value[
      tabCloseEvent.index
    ] as OrderProduct;
    this.productsForm.removeControl(productToBeRemoved.name);
    this.selectedProductsControl.value.splice(tabCloseEvent.index, 1);
    this.selectedProductsControl.setValue(this.selectedProductsControl.value);
    this.calculateOrderTotalAmount();
  }

  buildCreateOrderPayload() {
    return {
      description: this.orderForm.value.description,
      paymentMethod: this.orderForm.value.paymentMethod?.value,
      amount: this.orderForm.value.orderTotalAmount,
      customerId: this.orderForm.value.selectedCustomer?.id,
      totalProductQuantity: this.getTotalCountByProperty('quantity'),
      totalWeight: this.getTotalCountByProperty('weight', true).toString(),
      products: this.buildOrderProductsPayload(),
      orderDate: this.orderForm.value.orderDate,
    };
  }

  onRemoveProductRow(rowIndex: number, productName: string): void {
    this.productsForm.get(productName)?.setValue(
      this.productsForm.value[productName].quantity--
    );
    (this.productsForm.get(productName)?.get('orderProducts') as FormArray).removeAt(rowIndex);
    this.calculateOrderTotalAmount();
  }

  showToast(message: string, type = 'success') {
    this.messageService.add({
      severity: type,
      detail: message,
    });
  }

  private getTotalCountByProperty(
    propertyName: string,
    isFloatTypeValue = false
  ): number {
    const count = Object.values(this.productsForm.value).reduce(
      (total: number, product: any, index: number) => {
        const value = product[propertyName];
        return total + (isFloatTypeValue ? parseFloat(value) : value);
      },
      0
    );
    return count;
  }

  private buildOrderProductsPayload() {
    const orderProducts = flatMap(
      this.productsForm.value,
      (value) => value?.orderProducts
    );
    return orderProducts.map((product: OrderProductRecordTuple) => {
      return {
        id: product.id,
        cost: product.cost,
        color: product.color,
        price: this.productsForm.value[product.name]?.price,
        customizeName: product.customizeName,
        quantity: product.quantity ?? 0,
      };
    });
  }

  getFormByName(productName: string): FormGroup {
    return this.productsForm.get(productName) as FormGroup;
  }

  getOrderProductsFormArr(productName: string, index: number): FormGroup {
    const form = this.productsForm.get(productName)?.get('orderProducts') as FormArray;
    return form.controls[index] as FormGroup;
  }
}
