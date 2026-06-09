import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from '@angular/forms';
import { of } from 'rxjs';
import { delay, map } from 'rxjs';

// SYNC validator: a function (control) => errors | null. Here: reject whitespace.
export const noWhitespace: ValidatorFn = (c: AbstractControl): ValidationErrors | null =>
  /\s/.test(c.value ?? '') ? { whitespace: true } : null;

// CROSS-FIELD validator: attached to the GROUP, not a single control, so it can
// compare siblings. Here: password === confirm.
export const passwordsMatch: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const pw = group.get('password')?.value;
  const confirm = group.get('confirm')?.value;
  return pw === confirm ? null : { mismatch: true };
};

// ASYNC validator: returns an Observable (or Promise) of errors | null. Models a
// server round-trip; the control enters 'PENDING' status while it resolves.
const TAKEN = ['admin', 'root', 'mateus'];
export const usernameAvailable: AsyncValidatorFn = (c: AbstractControl) =>
  of((c.value ?? '').toLowerCase()).pipe(
    delay(500),
    map((value) => (TAKEN.includes(value) ? { taken: true } : null))
  );
