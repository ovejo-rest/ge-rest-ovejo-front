import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { AlertComponent, ButtonComponent, IconComponent } from 'src/ui';
import { emailFormatValidator, getPasswordStrength, passwordMatchValidator } from '../custom-validators';
import { NgClass } from '@angular/common';
import { SignUpTermsAndConditionsComponent } from 'src/ui/organisms/terms-and-conditions/sign-up';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FormsModule,
    NgClass,
    ReactiveFormsModule,
    RouterLink,
    AngularSvgIconModule,
    ButtonComponent,
    IconComponent,
    AlertComponent,
    SignUpTermsAndConditionsComponent,
  ],
})
export class SignUpComponent {
  hide = true;
  hideConfirm = true;
  passwordStrength = 0;

  private fb = inject(FormBuilder);

  form = this.fb.group(
    {
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
      acceptTerms: [false, [Validators.requiredTrue]],
    },
    {
      validators: [passwordMatchValidator('password', 'confirmPassword'), emailFormatValidator('email')],
    },
  );

  submitForm() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
  }

  updatePasswordStrength(event: Event) {
    const input = event.target as HTMLInputElement;
    this.passwordStrength = getPasswordStrength(input.value);
  }
}
