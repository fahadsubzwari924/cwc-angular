import { Component, Input } from '@angular/core';
import { SimpleModalComponent } from 'ngx-simple-modal';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss'],
})
export class ConfirmationModalComponent extends SimpleModalComponent<
  null,
  boolean
> {
  @Input() modalTitle!: string;
  @Input() modalDescription!: string;

  onConfirm(): void {
    this.result = true;
    this.close();
  }
}
