import { Component, inject } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

// REACTIVE FORMS: the form model lives in TypeScript, not the template. You get
// a typed, observable control tree you can validate and test in isolation.
@Component({
  selector: 'app-signup-form',
  imports: [ReactiveFormsModule, JsonPipe],
  template: `
    <h2>Reactive form (typed)</h2>
    <form [formGroup]="form" (ngSubmit)="submit()">
      <input formControlName="username" placeholder="username" />
      @if (form.controls.username.invalid && form.controls.username.touched) {
        <small>min 3 chars</small>
      }

      <input formControlName="email" placeholder="email" />
      @if (form.controls.email.invalid && form.controls.email.touched) {
        <small>valid email required</small>
      }

      <input formControlName="password" type="password" placeholder="password" />
      @if (form.controls.password.invalid && form.controls.password.touched) {
        <small>min 6 chars</small>
      }

      <button [disabled]="form.invalid">sign up</button>
    </form>

    @if (submitted) {
      <p>submitted: {{ form.value | json }}</p>
    }
  `,
})
export class SignupFormComponent {
  private readonly fb = inject(FormBuilder);
  submitted = false;

  // nonNullable.group() yields a strongly-typed group whose controls never
  // become null on reset — form.value is fully typed, no `| null` noise.
  form = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  submit() {
    if (this.form.valid) this.submitted = true;
  }
}
