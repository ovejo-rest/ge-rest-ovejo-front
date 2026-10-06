import { ChangeDetectionStrategy, Component, effect, inject, OnDestroy, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpStatusCode } from '@angular/common/http';
import { ButtonComponent, IconComponent, ModalCardComponent, SlotDirective, ToastService } from 'src/ui';
import { SetServicePinService, UserDto } from '../../data-access';

// PIN del POS: 4 dígitos exactos.
const PIN_LENGTH = 4;
const PIN_PATTERN = /^\d{4}$/;

function pinsMatch(group: AbstractControl): ValidationErrors | null {
  const { pin, confirm } = group.value as { pin: string; confirm: string };
  return pin && confirm && pin !== confirm ? { mismatch: true } : null;
}

@Component({
  selector: 'app-set-service-pin-modal',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, IconComponent, ModalCardComponent, SlotDirective],
  templateUrl: './set-service-pin-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetServicePinModalComponent implements OnDestroy {
  private readonly dialogRef = inject(MatDialogRef<SetServicePinModalComponent>);
  private readonly toast = inject(ToastService);
  private readonly pinService = inject(SetServicePinService);

  readonly user = inject<UserDto>(MAT_DIALOG_DATA);
  readonly $isLoading = this.pinService.$isLoading;
  readonly $showPin = signal(false);

  readonly form = inject(FormBuilder).nonNullable.group(
    {
      pin: ['', [Validators.required, Validators.pattern(PIN_PATTERN)]],
      confirm: ['', [Validators.required]],
    },
    { validators: pinsMatch },
  );

  constructor() {
    effect(() => {
      if (!this.pinService.$success()) return;
      this.toast.show(`PIN ${this.user.hasPin ? 'actualizado' : 'asignado'} para ${this.user.name}`, 'success');
      this.dialogRef.close(true);
    });
    effect(() => {
      const status = this.pinService.$error();
      if (!status) return;
      this.toast.show(
        status === HttpStatusCode.NotFound ? 'El usuario no pertenece a tu restaurante' : 'No se pudo asignar el PIN',
        'error',
      );
    });
  }

  // Solo dígitos, máximo 4.
  onlyDigits(control: 'pin' | 'confirm', event: Event) {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '').slice(0, PIN_LENGTH);
    if (digits !== input.value) this.form.controls[control].setValue(digits);
  }

  handleSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.show(
        this.form.hasError('mismatch') ? 'Los PIN no coinciden' : 'El PIN debe tener exactamente 4 dígitos',
        'warning',
      );
      return;
    }
    this.pinService.setPin({ userId: this.user.code, pin: this.form.getRawValue().pin });
  }

  handleCancel() {
    this.dialogRef.close(false);
  }

  ngOnDestroy(): void {
    this.pinService.reset();
  }
}
