import { AbstractControl, ValidationErrors } from '@angular/forms';

/** Requires value to be a non-empty array (for multi-select form controls). */
export function requireNonEmptyArray(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!Array.isArray(value) || value.length === 0) {
    return { required: true };
  }
  return null;
}
