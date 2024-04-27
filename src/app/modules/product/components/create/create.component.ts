import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SimpleModalComponent } from 'ngx-simple-modal';
import { ProgressSpinner } from 'primeng/progressspinner';
import { ProductService } from '../../services/product-api.service';
import { Product } from '../../models/product.model';
import { first, forEach } from 'lodash';

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
  productThumbnailName!: string;

  @ViewChild('fileInput') fileInput!: ElementRef;

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
      thumbnailImage: [''],
    });
  }

  saveProduct() {
    this.createProduct();
  }

  createProduct(): void {
    if (this.productForm.valid) {
      this.showSpinner = true;
      const payload = this.buildCreateProductPayload();
      this.productService
        .createProduct(payload)
        .subscribe((response: Product) => {
          this.closeModal();
        });
    }
  }

  closeModal() {
    this.showSpinner = false;
    this.result = true;
    this.close();
  }

  openFileUploader() {
    this.fileInput.nativeElement.click();
  }

  onUploadProductThumbnail(event: any): void {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      const selectedFile = first(files) as File;
      this.productThumbnailName = selectedFile.name;
      this.productForm.get('thumbnailImage')?.setValue(selectedFile);
    }
  }

  buildCreateProductPayload(): FormData {
    const formData = new FormData();
    forEach(this.productForm.value, (value, key) => {
      formData.append(key, value);
    });
    return formData;
  }

  private logFormData(formData: FormData): void {
    const formDataObj: { [key: string]: any } = {};
    formData.forEach((value, key) => {
      formDataObj[key] = value;
    });
  }
}
