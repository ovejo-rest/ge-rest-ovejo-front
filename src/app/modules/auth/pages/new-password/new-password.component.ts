import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { AlertComponent, ButtonComponent, IconComponent, ToastService } from 'src/ui';
import { getPasswordStrength, passwordMatchValidator, passwordStrengthValidator } from '../custom-validators';
import { NgClass } from '@angular/common';
import { TemporaryPasswordResponseDto } from '../dtos';
import { catchError, of, tap } from 'rxjs';
import { PasswordTransferService, ResetPasswordService } from '../data-access';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FormsModule,
    RouterLink,
    ReactiveFormsModule,
    AngularSvgIconModule,
    ButtonComponent,
    IconComponent,
    NgClass,
    AlertComponent,
  ],
})
export class NewPasswordComponent {
  hide = true;
  submitted = false;
  hideConfirm = true;
  passwordStrength = 0;
  email!: string;
  currentPassword!: string;
  constructor(
    private route: Router,
    private $passwordTransfer: PasswordTransferService,
    private readonly $httpService: ResetPasswordService,
    private readonly $toast: ToastService,
  ) {
    this.email = $passwordTransfer.email;
    this.currentPassword = $passwordTransfer.currentPassword;
  }
  private formBuilder = inject(FormBuilder);

  readonly $isLoading = this.$httpService.$isLoading;

  form = this.formBuilder.group(
    {
      password: ['', [Validators.required, passwordStrengthValidator(4)]],
      confirmPassword: ['', [Validators.required]],
    },
    {
      validators: [passwordMatchValidator('password', 'confirmPassword')],
    },
  );

  updatePasswordStrength(event: Event) {
    const input = event.target as HTMLInputElement;
    this.passwordStrength = getPasswordStrength(input.value);
  }

  submitForm() {
    this.submitted = true;

    const newPassword = this.form.get('password')!.value!;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.$httpService
      .reset({
        email: this.email,
        currentPassword: this.currentPassword,
        newPassword,
      })
      .pipe(
        tap((result: TemporaryPasswordResponseDto) => {
          if (result.code === 200) {
            this.$passwordTransfer.setCredentials((this.email = ''), (this.currentPassword = ''));
            this.route.navigateByUrl('/auth/sign-in');
            this.$toast.show(`Contraseña modificada con éxito`, 'success');
          }
        }),
        catchError((error) => {
          if (error.status === 401) {
            this.$toast.show(`Algo salió mal. Por favor, vuelve a intentar`, 'error');
          }

          return of(null);
        }),
      )
      .subscribe();
  }
}
