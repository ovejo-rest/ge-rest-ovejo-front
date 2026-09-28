import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ButtonComponent, IconComponent, ModalCardComponent, SlotDirective, ToastService } from 'src/ui';
import { AuthService } from 'src/app/modules/auth/pages/data-access';

// Salir del modo terminal requiere credenciales; quien las ingresa queda con la sesión del equipo.
@Component({
  selector: 'app-admin-exit-modal',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, IconComponent, ModalCardComponent, SlotDirective],
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

  handleCancel() {
    this.dialogRef.close(false);
  }
}
