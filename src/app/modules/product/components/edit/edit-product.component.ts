import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CreateComponent } from '../create/create.component';
import { FormGroup, Validators } from '@angular/forms';
import { Product } from '../../models/product.model';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
@Component({
  selector: 'app-edit-product',
  templateUrl: '../create/create.component.html',
  styleUrls: ['../create/create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputTextarea,
  ],
})
export class EditProductComponent extends CreateComponent implements OnInit {
  get product(): Product {
    return this.data?.['product'] as Product;
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
      thumbnailImage: [this.product?.thumbnailImage],
    });
    this.productThumbnailName = this.extractFileName(
      this.product?.thumbnailImage
    );
  }

  override saveProduct(): void {
    this.updateProduct();
  }

  updateProduct(): void {
    if (this.productForm.valid) {
      this.loadingService.show('Updating product...');
      const payload = this.buildCreateProductPayload();
      this.productService
        .updateProduct(Number(this.product.id), payload)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => this.closeModal(),
          error: () => this.loadingService.hide(),
        });
    }
  }

  private extractFileName(thumbnailImageURL: string): string {
    if (!thumbnailImageURL) return '';
    return thumbnailImageURL.split('/')[
      thumbnailImageURL.split('/').length - 1
    ];
  }
}
