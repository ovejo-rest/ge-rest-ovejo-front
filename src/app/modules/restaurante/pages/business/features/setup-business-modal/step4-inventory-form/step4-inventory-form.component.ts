import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, OnDestroy, output } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent, ToastService, ToggleComponent } from 'src/ui';
import { CompleteBusinessSetupStepService, ExpiryType, OnProductExpiry } from '../../../data-access';

@Component({
  selector: 'app-step4-inventory-form',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonComponent, ToggleComponent],
  templateUrl: './step4-inventory-form.component.html',
})
export class Step4InventoryFormComponent implements OnDestroy {
  readonly businessId = input.required<number>();
  readonly completed = output<void>();

  protected readonly $completeBusinessSetupStepService = inject(CompleteBusinessSetupStepService);
  private readonly $toast = inject(ToastService);

  protected readonly $isLoading = this.$completeBusinessSetupStepService.$isLoading;
  protected readonly $hasError = this.$completeBusinessSetupStepService.$hasError;
  protected readonly $errorMessage = this.$completeBusinessSetupStepService.$errorMessage;

  protected readonly expiryTypeOptions = [
    { value: ExpiryType.ADD_EXPIRY, label: 'Asignar fecha manualmente' },
    { value: ExpiryType.ADD_MANUFACTURING, label: 'Calcular desde fecha de fabricación' },
  ];

  protected readonly onProductExpiryOptions = [
    { value: OnProductExpiry.KEEP_SELLING, label: 'Seguir vendiendo' },
    { value: OnProductExpiry.STOP_SELLING, label: 'Dejar de vender' },
    { value: OnProductExpiry.AUTO_DELETE, label: 'Eliminar del inventario' },
  ];

  private fb = inject(FormBuilder);

  form = this.fb.group({
    skuPrefix: ['', [Validators.required]],
    enableProductExpiry: [false],
    expiryType: [ExpiryType.ADD_EXPIRY, [Validators.required]],
    onProductExpiry: [OnProductExpiry.KEEP_SELLING, [Validators.required]],
    stopSellingBefore: [0, [Validators.required]],
    stockExpiryAlertDays: [0, [Validators.required]],
  });

  constructor() {
    effect(() => {
      if (this.$isLoading()) {
        this.$toast.show('Guardando paso 4...', 'warning');
      }
      if (this.$completeBusinessSetupStepService.$success()) {
        this.$toast.show('Paso 4 completado', 'success');
        this.completed.emit();
      }
      if (this.$hasError()) {
        this.$toast.show(this.$errorMessage() ?? 'Algo salió mal. Por favor, vuelva a intentar.', 'error');
      }
    });
  }

  onEnableProductExpiryChange(checked: boolean) {
    this.form.get('enableProductExpiry')?.setValue(checked);
  }

  submitForm() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { skuPrefix, enableProductExpiry, expiryType, onProductExpiry, stopSellingBefore, stockExpiryAlertDays } =
      this.form.getRawValue();

    this.$completeBusinessSetupStepService.execute(this.businessId(), 4, {
      skuPrefix: skuPrefix ?? '',
      enableProductExpiry: enableProductExpiry ?? false,
      expiryType: expiryType ?? ExpiryType.ADD_EXPIRY,
      onProductExpiry: onProductExpiry ?? OnProductExpiry.KEEP_SELLING,
      stopSellingBefore: stopSellingBefore ?? 0,
      stockExpiryAlertDays: stockExpiryAlertDays ?? 0,
    });
  }

  ngOnDestroy(): void {
    this.$completeBusinessSetupStepService.reset();
  }
}
