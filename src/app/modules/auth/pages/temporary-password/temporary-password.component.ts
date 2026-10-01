import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { AlertComponent, ButtonComponent, IconComponent, ToastService } from 'src/ui';
import { emailFormatValidator, passwordMatchValidator } from '../custom-validators';
import { AuthService, getAuthError, PostLoginService } from '../data-access';

/**
 * Link de los correos de recuperación e invitación: con el código temporal se crea la contraseña,
 * la cuenta queda ACTIVA y se entra directo.
 */
@Component({
  selector: 'app-temporary-password',
  templateUrl: './temporary-password.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink, AlertComponent, ButtonComponent, IconComponent],
})
export class TemporaryPasswordComponent {
  private readonly authService = inject(AuthService);
  private readonly postLogin = inject(PostLoginService);
  private readonly toast = inject(ToastService);
  private readonly params = inject(ActivatedRoute).snapshot.queryParamMap;

  hide = true;
  submitted = false;
  readonly $isSaving = signal(false);
  readonly $error = signal<string | null>(null);

  readonly form = inject(FormBuilder).nonNullable.group(
    {
      email: [this.params.get('email') ?? '', [Validators.required]],
      code: [this.params.get('code') ?? '', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(72)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: [emailFormatValidator('email'), passwordMatchValidator('password', 'confirmPassword')] },
  );

  $validationMessage() {
    const controls = this.form.controls;
    if (controls.email.invalid || this.form.hasError('emailNotValid')) return 'Ingresa un email válido.';
    if (controls.code.invalid) return 'Ingresa el código temporal que te llegó por correo.';
    if (controls.password.invalid) return 'La contraseña debe tener entre 8 y 72 caracteres.';
    if (this.form.hasError('controlNotMatch')) return 'Las contraseñas deben ser iguales.';
    return null;
  }

  submit() {
    this.submitted = true;
    this.$error.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { email, code, password } = this.form.getRawValue();
    const normalizedEmail = email.trim().toLowerCase();
    this.$isSaving.set(true);
    this.authService
      .resetPassword(normalizedEmail, code.trim(), password)
      .pipe(switchMap(() => this.authService.login({ email: normalizedEmail, password })))
      .subscribe({
        next: (session) => {
          this.$isSaving.set(false);
          this.toast.show('Contraseña creada', 'success');
          this.postLogin.continue(session.userData.name);
        },
        error: (error: HttpErrorResponse) => {
          this.$isSaving.set(false);
          const message = String(error.error?.message ?? '').toLowerCase();
          if (error.status === HttpStatusCode.Unauthorized) this.$error.set('El código temporal es incorrecto.');
          else if (message.includes('pending password')) this.$error.set('No hay un código vigente para este email.');
          else this.$error.set(getAuthError(error).message);
        },
      });
  }
}
