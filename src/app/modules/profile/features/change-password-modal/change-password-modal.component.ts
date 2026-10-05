import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/modules/auth/pages/data-access';
import { ButtonComponent, IconComponent, ModalCardComponent, SlotDirective, ToastService } from 'src/ui';
import { ApiErrorCode, readApiError } from 'src/app/core/utils';
import { ProfileActionsService } from '../../data-access';

export type ChangePasswordModalData = Readonly<{ userCode: string; email: string }>;
export type ChangePasswordModalResult = 'changed' | 'code-sent' | 'cancelled';

const matchPasswords = (group: AbstractControl): ValidationErrors | null =>
  group.get('newPassword')?.value === group.get('confirmPassword')?.value ? null : { mismatch: true };

function passwordStrength(value: string): number {
  if (!value) return 0;
  let score = 0;
  if (value.length >= 8) score++;
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score++;
  if (/\d/.test(value)) score++;
  if (/[^A-Za-z0-9]/.test(value)) score++;
  return Math.max(1, score);
}

@Component({
  selector: 'app-change-password-modal',
  imports: [ReactiveFormsModule, ModalCardComponent, SlotDirective, ButtonComponent, IconComponent],
  templateUrl: './change-password-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordModalComponent {
  readonly #dialogRef = inject<MatDialogRef<ChangePasswordModalComponent, ChangePasswordModalResult>>(MatDialogRef);
  readonly #data = inject<ChangePasswordModalData>(MAT_DIALOG_DATA);
  readonly #actions = inject(ProfileActionsService);
  readonly #auth = inject(AuthService);
  readonly #toast = inject(ToastService);
  readonly #router = inject(Router);

  protected readonly email = this.#data.email;
  protected readonly $saving = signal(false);
  // La cuenta se creó con Google y no tiene contraseña: se ofrece crearla por correo.
  protected readonly $googleAccount = signal(false);
  protected readonly $show = signal({ current: false, next: false, confirm: false });
  protected submitted = false;

  protected readonly form = inject(FormBuilder).nonNullable.group(
    {
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(72)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: matchPasswords },
  );

  readonly #newPassword = toSignal(this.form.controls.newPassword.valueChanges, { initialValue: '' });
  protected readonly $strength = computed(() => passwordStrength(this.#newPassword()));
  protected readonly strengthLabels = ['', 'Débil', 'Regular', 'Buena', 'Fuerte'];

  protected toggle(field: 'current' | 'next' | 'confirm') {
    this.$show.update((show) => ({ ...show, [field]: !show[field] }));
  }

  protected invalid(field: 'currentPassword' | 'newPassword' | 'confirmPassword'): boolean {
    const control = this.form.controls[field];
    const mismatch = field === 'confirmPassword' && this.form.hasError('mismatch') && !!control.value;
    return (control.invalid || mismatch) && (control.touched || this.submitted);
  }

  protected submit() {
    this.submitted = true;
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      const { newPassword } = this.form.controls;
      this.#toast.show(
        newPassword.hasError('minlength')
          ? 'La nueva contraseña debe tener al menos 8 caracteres'
          : this.form.hasError('mismatch')
            ? 'Las contraseñas no coinciden'
            : 'Completa todos los campos',
        'warning',
      );
      return;
    }
    const { currentPassword, newPassword } = this.form.getRawValue();
    if (currentPassword === newPassword) {
      this.#toast.show('La nueva contraseña debe ser distinta a la actual', 'warning');
      return;
    }

    this.$saving.set(true);
    this.#actions.changePassword(this.#data.userCode, { currentPassword, newPassword }).subscribe({
      next: () => {
        this.$saving.set(false);
        this.#toast.show('Contraseña actualizada', 'success');
        this.#dialogRef.close('changed');
      },
      error: (error: HttpErrorResponse) => {
        this.$saving.set(false);
        const { code, message } = readApiError(error);
        // Cuenta creada con Google: aún no tiene contraseña.
        if (error.status === HttpStatusCode.BadRequest && /no password yet/i.test(message)) {
          this.$googleAccount.set(true);
          return;
        }
        this.#toast.show(
          code === ApiErrorCode.CURRENT_PASSWORD_INVALID
            ? 'La contraseña actual no es correcta'
            : error.status === 0
              ? 'Sin conexión con el servidor'
              : 'No se pudo cambiar la contraseña',
          'error',
        );
      },
    });
  }

  /** Cuenta de Google: el código llega por correo y la contraseña se define en la pantalla de código. */
  protected sendCreatePasswordCode() {
    this.$saving.set(true);
    this.#auth.forgotPassword(this.email).subscribe({
      next: () => {
        this.$saving.set(false);
        this.#toast.show('Te enviamos un código a tu correo para crear tu contraseña', 'success');
        this.#dialogRef.close('code-sent');
        this.#router.navigate(['/auth/temporary-password'], { queryParams: { email: this.email } });
      },
      error: () => {
        this.$saving.set(false);
        this.#toast.show('No se pudo enviar el código. Inténtalo de nuevo.', 'error');
      },
    });
  }

  protected cancel() {
    this.#dialogRef.close('cancelled');
  }
}
