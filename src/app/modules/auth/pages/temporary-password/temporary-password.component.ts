import { NgClass } from '@angular/common';
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { AlertComponent, ButtonComponent, IconComponent, ToastService } from 'src/ui';
import { emailFormatValidator } from '../custom-validators';
import { catchError, of, tap } from 'rxjs';
import { TemporaryPasswordService } from '../data-access/temporary-password.service';
import { PasswordTransferService } from '../data-access/password-transfer.service';
import { TemporaryPasswordResponseDto } from '../dtos';

@Component({
  selector: 'app-temporary-password',
  templateUrl: './temporary-password.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    AngularSvgIconModule,
    ButtonComponent,
    NgClass,
    IconComponent,
    AlertComponent,
  ],
})
export class TemporaryPasswordComponent {
  readonly #httpService = inject(TemporaryPasswordService);
  readonly #router = inject(Router);
  readonly #toast = inject(ToastService);
  readonly #fb = inject(FormBuilder);
  readonly #passwordTransfer = inject(PasswordTransferService);

  hide = true;
  submitted = false;
  passwordTextType!: boolean;
  errorMessage: string = '';
  readonly $isLoading = this.#httpService.$isLoading;

  form = this.#fb.group(
    {
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    },
    {
      validators: [emailFormatValidator('email')],
    },
  );

  get f() {
    return this.form.controls;
  }

  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  temporaryPassword() {
    this.submitted = true;
    const email = this.form.get('email')!.value!;
    const password = this.form.get('password')!.value!;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.#httpService
      .validate({ email, password })
      .pipe(
        tap((result: TemporaryPasswordResponseDto) => {
          if (result.code === 201) {
            this.#passwordTransfer.setCredentials(email, password);
            this.#router.navigateByUrl('/auth/new-password');
            this.#toast.show(`Contraseña temporal validada`, 'success');
          }
        }),
        catchError((error) => {
          if (error.status === 409) {
            this.#toast.show(`Algo salió mal, corrobora tus datos y vuelve a intentar.`, 'error');
          }

          if (error.status === 401) {
            this.#toast.show(`Contraseña temporal inválida, vuelva a intentar.`, 'error');
          }

          return of(null);
        }),
      )
      .subscribe();
  }
}
