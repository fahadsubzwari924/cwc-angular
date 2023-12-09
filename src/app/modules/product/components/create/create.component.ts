import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SimpleModalComponent } from 'ngx-simple-modal';
import { ProgressSpinner } from 'primeng/progressspinner';
import { ProductService } from '../../services/product-api.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-create-product',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent
  extends SimpleModalComponent<null, boolean>
  implements OnInit
{
  title!: string;

  productForm!: FormGroup;
  spinner!: ProgressSpinner;
  showSpinner = false;

  constructor(
    protected formBuilder: FormBuilder,
    protected productService: ProductService
  ) {
    super();
    this.spinner = new ProgressSpinner();
  }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    this.productForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      cost: ['', [Validators.required]],
      description: [''],
      weight: [''],
    });
  }

  saveProduct() {
    this.createProduct();
  }

  createProduct(): void {
    this.showSpinner = true;
    this.productService
      .createProduct(this.productForm.value)
      .subscribe((response: Product) => {
        this.closeModal();
      });
  }

  closeModal() {
    this.showSpinner = false;
    this.result = true;
    this.close();
  }
}
