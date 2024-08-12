import { Component, OnInit } from '@angular/core';
import { CreateOrderComponent } from '../create-order/create-order.component';
import { CustomerService } from 'src/app/modules/customers/services/customer.service';
import { ProductService } from 'src/app/modules/product/services/product-api.service';
import { FormBuilder, Validators } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from '../../models/order.model';
import { OrderProduct } from '../../models/order-product.model';
import { groupBy, uniqBy } from 'lodash';
import { OrderSourceService } from 'src/app/modules/order-source/services/order-source.service';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-edit-order',
  templateUrl: '../create-order/create-order.component.html',
  styleUrls: ['../create-order/create-order.component.scss'],
})
export class EditOrderComponent extends CreateOrderComponent implements OnInit {
  orderId!: number;
  order!: Order;

  constructor(
    override customerService: CustomerService,
    override productService: ProductService,
    override formBuilder: FormBuilder,
    override orderService: OrderService,
    override messageService: MessageService,
    override router: Router,
    private activatedRoute: ActivatedRoute,
    override orderSourceService: OrderSourceService,
    override titleCasePipe: TitleCasePipe
  ) {
    super(
      customerService,
      productService,
      formBuilder,
      orderService,
      messageService,
      router,
      orderSourceService,
      titleCasePipe
    );
  }

  override ngOnInit(): void {
    this.buildOrderForm();
    this.buildPaymentMethodOptions();
    this.orderId = Number(this.activatedRoute.snapshot.paramMap.get('orderId'));
    if (this.orderId) {
      this.getOrder();
    }
  }

  override buildOrderForm(): void {
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
      orderDate: ['', [Validators.required]],
      orderProducts: this.formBuilder.group({}),
    });
  }

  override saveOrder(): void {
    if (this.orderId) {
      this.showSpinner = true;
      const updateOrderPayload = this.buildCreateOrderPayload();
      this.orderService
        .updateOrder(this.orderId, updateOrderPayload)
        .subscribe((res) => {
          this.showSpinner = false;
          this.showToast('Order updated!');
          this.router.navigate(['/orders']);
        });
    } else {
      this.showToast('Order ID not found!', 'warning');
    }
  }

  getOrder() {
    this.orderService.getOrderById(this.orderId).subscribe((order: Order) => {
      this.order = order;
      this.populateOrderForm();
    });
  }

  populateOrderForm() {
    this.orderForm.get('selectedCustomer')?.setValue(this.order.customer);
    this.orderForm.get('description')?.setValue(this.order.description);
    const productsByOrderId = uniqBy(this.order.products, 'id');
    this.orderForm.get('selectedProducts')?.setValue(productsByOrderId);
    this.orderForm.get('orderDate')?.setValue(new Date(this.order.orderDate));
    productsByOrderId.forEach((product: OrderProduct) => {
      this.initizalizeProductDetail(product, true);
    });
    this.populateProductRows();
    this.calculateOrderTotalAmount();
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
    this.canShowProductDetailsTable = true;
  }
}
