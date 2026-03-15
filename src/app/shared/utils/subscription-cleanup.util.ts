/**
 * Subscription cleanup utilities for Angular 19.
 *
 * Use takeUntilDestroyed() in component constructors or field initializers (injection context)
 * so subscriptions are automatically unsubscribed when the component is destroyed.
 *
 * @example
 * ```ts
 * constructor() {
 *   this.service.getData()
 *     .pipe(takeUntilDestroyed())
 *     .subscribe(data => this.data.set(data));
 * }
 * ```
 */
export { takeUntilDestroyed } from '@angular/core/rxjs-interop';
