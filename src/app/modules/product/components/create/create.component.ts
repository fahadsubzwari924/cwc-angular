import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BaseDialogComponent } from 'src/app/shared/components/base-dialog/base-dialog.component';
import { LoadingService } from 'src/app/core/services/loading.service';
import { ProductService } from '../../services/product-api.service';
import { Product } from '../../models/product.model';
import { first, forEach } from 'lodash-es';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';

@Component({
  selector: 'app-create-product',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputTextarea,
  ],
})
export class CreateComponent extends BaseDialogComponent implements OnInit {
  protected readonly formBuilder = inject(FormBuilder);
  protected readonly productService = inject(ProductService);
  protected readonly destroyRef = inject(DestroyRef);
  protected readonly loadingService = inject(LoadingService);

  get title(): string {
    return this.data?.['title'] ?? 'Create Product';
  }

  productForm!: FormGroup;
  productThumbnailName!: string;

  @ViewChild('fileInput') fileInput!: ElementRef;

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
      this.loadingService.show('Saving product...');
      const payload = this.buildCreateProductPayload();
      this.productService
        .createProduct(payload)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => this.closeModal(),
          error: () => this.loadingService.hide(),
        });
    }
  }

  closeModal(): void {
    this.loadingService.hide();
    this.close(true);
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
}
