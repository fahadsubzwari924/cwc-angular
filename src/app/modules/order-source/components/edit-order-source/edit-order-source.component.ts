import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Validators } from '@angular/forms';
import { CreateOrderSourceComponent } from '../create-order-source/create-order-source.component';
import { OrderSource } from '../../models/order-source.model';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextarea } from 'primeng/inputtextarea';
@Component({
  selector: 'app-edit-order-source',
  templateUrl: '../create-order-source/create-order-source.component.html',
  styleUrls: ['../create-order-source/create-order-source.component.scss'],
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
export class EditOrderSourceComponent
  extends CreateOrderSourceComponent
  implements OnInit
{
  get orderSource(): any {
    return this.data?.['orderSource'];
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
    this.loadingService.show('Updating order source...');
    this.orderSourceService
      .updateOrderSource(this.orderSourceForm.value)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.closeModal(),
        error: () => this.loadingService.hide(),
      });
  }
}
