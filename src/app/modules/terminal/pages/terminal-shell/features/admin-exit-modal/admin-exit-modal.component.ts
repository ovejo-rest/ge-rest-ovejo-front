import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ButtonComponent, IconComponent, ModalCardComponent, SlotDirective, ToastService } from 'src/ui';
import { AuthService, getAuthError } from 'src/app/modules/auth/pages/data-access';
import { GoogleButtonComponent } from 'src/app/modules/auth/pages/ui';

// Salir del modo terminal requiere credenciales; quien las ingresa queda con la sesión del equipo.
@Component({
  selector: 'app-admin-exit-modal',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, IconComponent, ModalCardComponent, SlotDirective, GoogleButtonComponent],
  templateUrl: './admin-exit-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminExitModalComponent {
  private readonly dialogRef = inject<MatDialogRef<AdminExitModalComponent, boolean>>(MatDialogRef);
  private readonly toast = inject(ToastService);
  private readonly authService = inject(AuthService);

  readonly $isChecking = signal(false);
  readonly form = inject(FormBuilder).nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  handleSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.show('Ingresa email y contraseña', 'warning');
      return;
    }
    this.$isChecking.set(true);
    this.authService.login(this.form.getRawValue()).subscribe({
      next: () => this.dialogRef.close(true),
      error: () => {
        this.$isChecking.set(false);
        this.form.controls.password.reset();
        this.toast.show('Credenciales incorrectas', 'error');
      },
    });
  }

  // Cuentas creadas con Google no tienen contraseña: también pueden salir con Google.
  handleGoogle(idToken: string) {
    this.$isChecking.set(true);
    this.authService.loginWithGoogle(idToken).subscribe({
      next: () => this.dialogRef.close(true),
      error: (error) => {
        this.$isChecking.set(false);
        this.toast.show(getAuthError(error).message, 'error');
      },
    });
  }

  handleCancel() {
    this.dialogRef.close(false);
  }
}
