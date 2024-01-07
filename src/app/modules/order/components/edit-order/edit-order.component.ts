import { Component, OnInit } from '@angular/core';
import { CreateOrderComponent } from '../create-order/create-order.component';
import { CustomerService } from 'src/app/modules/customers/services/customer.service';
import { ProductService } from 'src/app/modules/product/services/product-api.service';
import { FormBuilder, Validators } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from '../../models/order.model';
import { CustomResponse } from 'src/app/shared/models/response.model';
import { OrderProduct } from '../../models/order-product.model';
import { groupBy, uniqBy } from 'lodash';

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
    private activatedRoute: ActivatedRoute
  ) {
    super(
      customerService,
      productService,
      formBuilder,
      orderService,
      messageService,
      router
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
      orderDate: ['', [Validators.required]]
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
    if (productsByOrderId) {
      productsByOrderId.forEach((orderProduct: OrderProduct) => {
        this.productDetails[orderProduct.name] = {
          quantity: orderProduct?.quantity,
          price: orderProduct.price,
          orderProducts: [],
          weight: orderProduct.weight,
        };
      });
    }

    console.log(this.orderForm.value);
    this.populateProductRows();
    this.calculateOrderTotalAmount();
  }

  private populateProductRows(): void {
    const productsGroupByOrderId = groupBy(this.order.products, 'id');
    Object.keys(productsGroupByOrderId).forEach((orderProductKey: string) => {
      const orderProductGroup = productsGroupByOrderId[orderProductKey];
      for (let i = 0; i < orderProductGroup.length; i++) {
        this.productDetails[orderProductGroup[i].name].orderProducts.push({
          id: orderProductGroup[i].id ?? 0,
          color: orderProductGroup[i]?.color ?? '',
          customizeName: orderProductGroup[i]?.customizeName ?? '',
          name: orderProductGroup[i].name,
          cost: orderProductGroup[i].cost,
          weight: orderProductGroup[i].weight,
          quantity: orderProductGroup[i].quantity,
        });
      }
      this.canShowProductDetailsTable = true;
    });
  }
}
