import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { flatMap } from 'lodash';
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

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

interface OrderProductRecordTuple {
  id: number;
  color?: string;
  customizeName?: string;
  name: string;
  cost: number;
  weight: string;
}

interface ProductTuple {
  quantity: number;
  price: number;
  weight: string | number;
  orderProducts: Array<OrderProductRecordTuple>;
}

interface ProductDetail {
  [key: string]: ProductTuple;
}

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

  constructor(
    private customerService: CustomerService,
    private productService: ProductService,
    private formBuilder: FormBuilder
  ) {}

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

  onProductSelect(): void {
    this.selectedProductsControl.value.forEach((selectedProduct: Product) => {
      this.productDetails[selectedProduct.name] = {
        quantity: 0,
        price: 0,
        orderProducts: [],
        weight: selectedProduct?.weight,
      };
    });
  }

  onSelectProductQuantity(product: Product, productQuantity: number) {
    for (let i = 0; i < productQuantity; i++) {
      this.productDetails[product.name].orderProducts.push({
        id: product.id ?? 0,
        color: '',
        customizeName: '',
        name: product.name,
        cost: product.cost,
        weight: product.weight,
      });
    }
    this.canShowProductDetailsTable = true;
  }

  onPriceChange(): void {
    this.orderTotalAmount = 0;
    Object.keys(this.productDetails).forEach((productName: string) => {
      if (this.productDetails[productName].price > 0) {
        this.orderTotalAmount +=
          this.productDetails[productName].price *
          this.productDetails[productName].quantity;
      } else {
        this.orderTotalAmount = this.orderTotalAmount;
      }
    });
  }

  createOrder() {
    const createOrderPayload = this.buildCreateOrderPayload();
    console.log(createOrderPayload);
  }

  private buildPaymentMethodOptions(): void {
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

  private getTotalCountByProperty(
    propertyName: string,
    isFloatTypeValue = false
  ): number {
    return Object.values(this.productDetails).reduce(
      (total: number, product: any) => {
        console.log(product[propertyName]);
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

  private buildCreateOrderPayload() {
    return {
      description: this.orderForm.value.description,
      paymentMethod: this.orderForm.value.paymentMethod?.value,
      amount: this.orderTotalAmount,
      customerId: this.orderForm.value.selectedCustomer?.id,
      totalProductQuantity: this.getTotalCountByProperty('quantity'),
      totalWeight: this.getTotalCountByProperty('weight', true),
      products: this.buildOrderProductsPayload(),
    };
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
      };
    });
  }
}
