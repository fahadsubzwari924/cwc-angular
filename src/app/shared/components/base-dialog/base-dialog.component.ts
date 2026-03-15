import { inject } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';

/**
 * Base class for all dialog components. Replaces ngx-simple-modal's SimpleModalComponent.
 * Extend this class and call this.close(result) to close the dialog with a result.
 */
export abstract class BaseDialogComponent<TData = Record<string, any>, TResult = boolean> {
  protected readonly dialogRef = inject(DynamicDialogRef);
  protected readonly dialogConfig = inject(DynamicDialogConfig);

  get data(): TData {
    return this.dialogConfig.data as TData;
  }

  close(result?: TResult): void {
    this.dialogRef.close(result);
  }
}
