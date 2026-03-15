import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CreateOrderComponent } from '../create-order/create-order.component';
import { requireNonEmptyArray } from '../../validators/order.validators';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Order } from '../../models/order.model';
import { OrderProduct } from '../../models/order-product.model';
import { groupBy, uniqBy } from 'lodash-es';
import { OrderSource } from 'src/app/modules/order-source/models/order-source.model';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DropdownModule } from 'primeng/dropdown';
import { DatePickerModule } from 'primeng/datepicker';
import { TabViewModule } from 'primeng/tabview';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-edit-order',
  templateUrl: '../create-order/create-order.component.html',
  styleUrls: ['../create-order/create-order.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
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
export class EditOrderComponent extends CreateOrderComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);

  orderId!: number;
  order!: Order;

  override ngOnInit(): void {
    this.buildOrderForm();
    this.buildPaymentMethodOptions();
    this.orderId = Number(this.activatedRoute.snapshot.paramMap.get('orderId'));
    if (this.orderId) {
      this.getOrder();
      this.getOrderSources();
    }
  }

  override buildOrderForm(): void {
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
      orderDate: ['', [Validators.required]],
      orderProducts: this.formBuilder.group({}),
      selectedOrderSources: ['', [Validators.required]],
    });
  }

  override saveOrder(): void {
    if (this.orderId) {
      this.loadingService.show('Updating order...');
      const updateOrderPayload = this.buildCreateOrderPayload();
      this.orderService
        .updateOrder(this.orderId, updateOrderPayload)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.loadingService.hide();
            this.showToast('Order updated!');
            this.router.navigate(['/orders']);
          },
          error: () => this.loadingService.hide(),
        });
    } else {
      this.showToast('Order ID not found!', 'warning');
    }
  }

  getOrder() {
    this.orderService
      .getOrderById(this.orderId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((order: Order) => {
        this.order = order;
        this.populateOrderForm();
      });
  }

  populateOrderForm() {
    const orderSourceIds = this.order.orderSources.map(
      (orderSource: OrderSource) => orderSource.id
    );
    this.orderForm.get('selectedCustomer')?.setValue(this.order.customer);
    this.orderForm.get('description')?.setValue(this.order.description);
    const productsByOrderId = uniqBy(this.order.products, 'id');
    this.orderForm.get('selectedProducts')?.setValue(productsByOrderId);
    this.orderForm.get('orderDate')?.setValue(new Date(this.order.orderDate));
    this.orderForm.get('selectedOrderSources')?.setValue(orderSourceIds);
    productsByOrderId.forEach((product: OrderProduct) => {
      // Store product data so it's available for map building
      this['productDataMap'].set(product.name, product);
      this.initizalizeProductDetail(product, true);
    });
    this.populateProductRows();
    this.calculateOrderTotalAmount();
    this.refreshOrderProductsMap();
  }

  private populateProductRows(): void {
    const productsGrupedByName = groupBy(this.order.products, 'name');
    Object.keys(productsGrupedByName).forEach((orderProductKey: string) => {
      this.order.products?.forEach((orderProduct: OrderProduct) => {
        if (orderProduct.name === orderProductKey) {
          this.addOrderProductRow(orderProduct as OrderProduct);
        }
      });
    });
    this.canShowProductDetailsTable.set(true);
  }
}
