import { Component, OnInit } from '@angular/core';
import { OrderSourceService } from '../../services/order-source.service';
import { PaginationConstants } from 'src/app/shared/constants/pagination.constants';
import { SimpleModalComponent, SimpleModalService } from 'ngx-simple-modal';
import { MessageService } from 'primeng/api';
import { UtilService } from 'src/app/util/util.service';
import { OrderSource } from '../../models/order-source.model';
import { CustomResponse } from 'src/app/shared/models/response.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProgressSpinner } from 'primeng/progressspinner';
import { INameValue } from 'src/app/shared/interfaces/name-value.interface';

@Component({
  selector: 'app-create-order-source',
  templateUrl: './create-order-source.component.html',
  styleUrls: ['./create-order-source.component.scss'],
})
export class CreateOrderSourceComponent
  extends SimpleModalComponent<null, boolean>
  implements OnInit
{
  title!: string;

  orderSourceForm!: FormGroup;
  spinner!: ProgressSpinner;
  showSpinner = false;
  orderSourceTypes: Array<INameValue> = [];

  constructor(
    protected formBuilder: FormBuilder,
    protected orderSourceService: OrderSourceService
  ) {
    super();
    this.spinner = new ProgressSpinner();
  }

  ngOnInit(): void {
    this.buildForm();
    this.buildOrderSourceOptions();
  }

  buildForm(): void {
    this.orderSourceForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      type: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
  }

  buildOrderSourceOptions(): void {
    this.orderSourceTypes = [
      {
        name: 'Instagram',
        value: 'instagram',
      },
      {
        name: 'Facebook',
        value: 'facebook',
      },
      {
        name: 'Web',
        value: 'web',
      },
    ];
  }

  saveOrderSource() {
    this.createOrderSource();
  }

  createOrderSource(): void {
    this.showSpinner = true;
    this.orderSourceService
      .createOrderSource(this.orderSourceForm.value)
      .subscribe((response: OrderSource) => {
        this.closeModal();
      });
  }

  closeModal() {
    this.showSpinner = false;
    this.result = true;
    this.close();
  }
}
