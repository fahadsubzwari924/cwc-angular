import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { OrderSourceService } from '../../services/order-source.service';
import { BaseDialogComponent } from 'src/app/shared/components/base-dialog/base-dialog.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { INameValue } from 'src/app/shared/interfaces/name-value.interface';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextarea } from 'primeng/inputtextarea';
import { LoadingService } from 'src/app/core/services/loading.service';

@Component({
  selector: 'app-create-order-source',
  templateUrl: './create-order-source.component.html',
  styleUrls: ['./create-order-source.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    InputTextarea,
  ],
})
export class CreateOrderSourceComponent extends BaseDialogComponent implements OnInit {
  protected readonly formBuilder = inject(FormBuilder);
  protected readonly orderSourceService = inject(OrderSourceService);
  protected readonly destroyRef = inject(DestroyRef);
  protected readonly loadingService = inject(LoadingService);

  get title(): string {
    return this.data?.['title'] ?? 'Create Order Source';
  }

  orderSourceForm!: FormGroup;
  orderSourceTypes: Array<INameValue> = [];

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
      { name: 'Instagram', value: 'instagram' },
      { name: 'Facebook', value: 'facebook' },
      { name: 'Web', value: 'web' },
    ];
  }

  saveOrderSource() {
    this.createOrderSource();
  }

  createOrderSource(): void {
    this.loadingService.show('Saving order source...');
    this.orderSourceService
      .createOrderSource(this.orderSourceForm.value)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.closeModal(),
        error: () => this.loadingService.hide(),
      });
  }

  closeModal(): void {
    this.loadingService.hide();
    this.close(true);
  }
}
