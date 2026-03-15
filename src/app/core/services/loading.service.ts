import { Injectable, signal, computed } from '@angular/core';

/**
 * Global loading state service. Use show()/hide() for full-screen overlay.
 * Supports multiple concurrent callers: overlay stays visible until all callers call hide().
 */
@Injectable({ providedIn: 'root' })
export class LoadingService {
  private readonly loadingCount = signal(0);

  /** True when at least one caller has requested loading. */
  readonly isLoading = computed(() => this.loadingCount() > 0);

  /** Optional message shown in the overlay (last show() wins). */
  readonly message = signal<string | undefined>(undefined);

  /**
   * Show the global loading overlay. Call hide() when the operation completes.
   * @param message Optional short message (e.g. "Saving...", "Loading...").
   */
  show(message?: string): void {
    if (message !== undefined) {
      this.message.set(message);
    }
    this.loadingCount.update((c) => c + 1);
  }

  /**
   * Hide the loading overlay. If show() was called multiple times (e.g. by concurrent requests),
   * the overlay hides when the number of hide() calls matches the number of show() calls.
   */
  hide(): void {
    this.loadingCount.update((c) => Math.max(0, c - 1));
    if (this.loadingCount() === 0) {
      this.message.set(undefined);
    }
  }
}
