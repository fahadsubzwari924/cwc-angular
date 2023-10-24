import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SimpleModalComponent } from 'ngx-simple-modal';
import { ProgressSpinner } from 'primeng/progressspinner';
import { ProductService } from '../../services/product-api.service';
import { Product } from '../../models/product.model';
import { eCRUDActions } from 'src/app/shared/enums/crud-actions.enum';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent
  extends SimpleModalComponent<null, boolean>
  implements OnInit
{
  title!: string;
  action!: string;
  product!: Product;

  createProductForm!: FormGroup;
  spinner!: ProgressSpinner;
  showSpinner = false;

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService
  ) {
    super();
    this.spinner = new ProgressSpinner();
  }

  ngOnInit(): void {
    this.buildForm(this.product);
  }

  buildForm(data?: Product): void {
    this.createProductForm = this.formBuilder.group({
      id: [data?.id],
      name: [data?.name ?? '', [Validators.required, Validators.minLength(5)]],
      cost: [data?.cost ?? '', [Validators.required]],
      description: [data?.description ?? ''],
      weight: [data?.weight ?? ''],
    });
  }

  saveProduct() {
    if (this.action === eCRUDActions.ADD) {
      this.createProduct();
    } else {
      this.updateProduct();
    }
  }

  createProduct(): void {
    this.showSpinner = true;
    this.productService
      .createProduct(this.createProductForm.value)
      .subscribe((response: Product) => {
        this.closeModal();
      });
  }

  updateProduct(): void {
    this.showSpinner = true;
    this.productService.updateProduct(this.createProductForm.value)
    .subscribe((response: any) => {
      this.closeModal();
    })
  }

  closeModal() {
    this.showSpinner = false;
    this.close();
  }
}
