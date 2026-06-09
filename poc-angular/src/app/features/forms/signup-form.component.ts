import { Component, inject } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { noWhitespace, passwordsMatch, usernameAvailable } from './validators';

// REACTIVE FORMS: the form model lives in TypeScript, not the template. You get
// a typed, observable control tree you can validate and test in isolation.
@Component({
  selector: 'app-signup-form',
  imports: [ReactiveFormsModule, JsonPipe],
  template: `
    <h2>Reactive form (typed) + custom validators</h2>
    <form [formGroup]="form" (ngSubmit)="submit()">
      <input formControlName="username" placeholder="username" />
      @if (form.controls.username.pending) {
        <small>checking availability…</small>
      } @else if (form.controls.username.touched && form.controls.username.invalid) {
        @if (form.controls.username.hasError('whitespace')) { <small>no spaces</small> }
        @else if (form.controls.username.hasError('taken')) { <small>username taken</small> }
        @else { <small>min 3 chars</small> }
      }

      <input formControlName="email" placeholder="email" />
      @if (form.controls.email.invalid && form.controls.email.touched) {
        <small>valid email required</small>
      }

      <input formControlName="password" type="password" placeholder="password" />
      <input formControlName="confirm" type="password" placeholder="confirm password" />
      <!-- group-level error surfaces from the cross-field validator -->
      @if (form.hasError('mismatch') && form.controls.confirm.touched) {
        <small>passwords don't match</small>
      }

      <button [disabled]="form.invalid || form.pending">sign up</button>
    </form>

    @if (submitted) {
      <p>submitted: {{ form.value | json }}</p>
    }
  `,
})
export class SignupFormComponent {
  private readonly fb = inject(FormBuilder);
  submitted = false;

  form = this.fb.nonNullable.group(
    {
      // 3rd slot = async validators; the control goes PENDING while they run.
      username: ['', [Validators.required, Validators.minLength(3), noWhitespace], [usernameAvailable]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm: ['', [Validators.required]],
    },
    // group-level validator runs across siblings
    { validators: passwordsMatch }
  );

  submit() {
    if (this.form.valid) this.submitted = true;
  }
}
