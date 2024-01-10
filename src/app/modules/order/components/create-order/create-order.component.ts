import { Component, OnInit } from '@angular/core';
import {
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
import { Order } from '../../models/order.model';
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
    });
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
    this.productDetails[selectedProduct.name] = {
      quantity: 0,
      price: 0,
      orderProducts: [],
      weight: selectedProduct?.weight,
    };
    this.addOrderProductRow(selectedProduct);
    this.canShowProductDetailsTable = true;
  }

  onSelectProductQuantity(product: OrderProduct, productQuantity: number) {
    for (let i = 0; i < productQuantity; i++) {
      this.productDetails[product.name].orderProducts.push({
        id: product.id ?? 0,
        color: product?.color ?? '',
        customizeName: product?.customizeName ?? '',
        name: product.name,
        cost: product.cost,
        weight: product.weight,
        quantity: this.productDetails[product.name].quantity ?? 0,
      });
    }
    this.canShowProductDetailsTable = true;
  }

  addOrderProductRow(product: Product): void {
    this.productDetails[product.name].orderProducts.push({
      id: product.id ?? 0,
      color: '',
      customizeName: '',
      name: product?.name,
      cost: product?.cost,
      weight: product?.weight,
      quantity: this.productDetails[product.name]?.quantity ?? 0,
    });
    this.calculateOrderTotalAmount();
  }

  calculateOrderTotalAmount(): void {
    this.orderTotalAmount = 0;
    Object.keys(this.productDetails).forEach((productName: string) => {
      const orderProductQuantity =
        this.productDetails[productName].orderProducts?.length;
      if (this.productDetails[productName].price > 0) {
        this.orderTotalAmount +=
          this.productDetails[productName].price * orderProductQuantity;
      } else {
        this.orderTotalAmount = this.orderTotalAmount;
      }
    });
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
    this.productDetails = omit(this.productDetails, orderProduct.name);
    this.calculateOrderTotalAmount();
  }

  onProductTabClose(tabCloseEvent: TabCloseEvent) {
    const productToBeRemoved = this.selectedProductsControl.value[
      tabCloseEvent.index
    ] as OrderProduct;
    this.productDetails = omit(this.productDetails, productToBeRemoved.name);
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
      totalProductQuantity: this.getTotalCountByProperty('quantity'),
      totalWeight: this.getTotalCountByProperty('weight', true).toString(),
      products: this.buildOrderProductsPayload(),
      orderDate: this.orderForm.value.orderDate,
    };
  }

  onRemoveProductRow(rowIndex: number, productName: string): void {
    this.productDetails[productName].quantity--;
    this.productDetails[productName].orderProducts.splice(rowIndex, 1);
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
    return Object.values(this.productDetails).reduce(
      (total: number, product: any) => {
        return (
          total +
          (isFloatTypeValue
            ? parseFloat(product[propertyName])
            : product[propertyName])
        );
      },
      0
    );
  }

  private buildOrderProductsPayload() {
    const orderProducts = flatMap(
      this.productDetails,
      (value) => value.orderProducts
    );
    return orderProducts.map((product: OrderProductRecordTuple) => {
      return {
        id: product.id,
        cost: product.cost,
        color: product.color,
        price: this.productDetails[product.name].price,
        customizeName: product.customizeName,
        quantity: product.quantity,
      };
    });
  }
}
