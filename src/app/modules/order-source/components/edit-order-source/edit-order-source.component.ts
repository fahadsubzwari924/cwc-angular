import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateOrderSourceComponent } from '../create-order-source/create-order-source.component';
import { OrderSource } from '../../models/order-source.model';
import { OrderSourceService } from '../../services/order-source.service';

@Component({
  selector: 'app-edit-order-source',
  templateUrl: '../create-order-source/create-order-source.component.html',
  styleUrls: ['../create-order-source/create-order-source.component.scss'],
})
export class EditOrderSourceComponent
  extends CreateOrderSourceComponent
  implements OnInit
{
  orderSource!: OrderSource;

  constructor(
    override formBuilder: FormBuilder,
    override orderSourceService: OrderSourceService
  ) {
    super(formBuilder, orderSourceService);
  }

  override ngOnInit(): void {
    this.buildOrderSourceOptions();
    this.buildForm();
  }

  override buildForm(): void {
    this.orderSourceForm = this.formBuilder.group({
      id: [this.orderSource?.id],
      name: [
        this.orderSource?.name,
        [Validators.required, Validators.minLength(5)],
      ],
      type: [this.orderSource?.type.toLocaleLowerCase(), [Validators.required]],
      description: [this.orderSource?.description, [Validators.required]],
    });
  }

  override saveOrderSource(): void {
    this.updateOrderSource();
  }

  updateOrderSource(): void {
    this.showSpinner = true;
    this.orderSourceService
      .updateOrderSource(this.orderSourceForm.value)
      .subscribe((response: any) => {
        this.closeModal();
      });
  }
}
