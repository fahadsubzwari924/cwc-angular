import { Component, OnInit } from '@angular/core';
import { CreateComponent } from '../create/create.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../services/product-api.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-edit-product',
  templateUrl: '../create/create.component.html',
  styleUrls: ['../create/create.component.scss'],
})
export class EditProductComponent extends CreateComponent implements OnInit {
  product!: Product;

  constructor(
    override formBuilder: FormBuilder,
    override productService: ProductService
  ) {
    super(formBuilder, productService);
  }

  override ngOnInit(): void {
    this.buildForm();
  }

  override buildForm(): void {
    this.productForm = this.formBuilder.group({
      id: [this.product?.id],
      name: [
        this.product?.name,
        [Validators.required, Validators.minLength(5)],
      ],
      cost: [this.product?.cost, [Validators.required]],
      description: [this.product?.description],
      weight: [this.product?.weight],
      thumbnailImage: [''],
    });
  }

  override saveProduct(): void {
    this.updateProduct();
  }

  updateProduct(): void {
    this.showSpinner = true;
    this.productService
      .updateProduct(this.productForm.value)
      .subscribe((response: any) => {
        this.closeModal();
      });
  }
}
