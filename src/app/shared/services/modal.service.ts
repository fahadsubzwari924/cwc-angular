import { Injectable, inject, Type } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, from } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ModalService {
  private readonly dialogService = inject(DialogService);

  open<TResult = boolean>(
    component: Type<any>,
    data: Record<string, any> = {},
    options: {
      header?: string;
      width?: string;
      modal?: boolean;
      closable?: boolean;
    } = {}
  ): Observable<TResult | undefined> {
    const ref: DynamicDialogRef = this.dialogService.open(component, {
      header: options.header,
      width: options.width ?? '500px',
      modal: options.modal ?? true,
      closable: options.closable ?? true,
      data,
    });

    return new Observable<TResult | undefined>((observer) => {
      const sub = ref.onClose.subscribe((result: TResult | undefined) => {
        observer.next(result);
        observer.complete();
      });
      return () => sub.unsubscribe();
    });
  }
}
