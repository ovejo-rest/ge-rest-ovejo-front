import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, OnDestroy, output } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent, ToastService, ToggleComponent } from 'src/ui';
import { CompleteBusinessSetupStepService, EnabledModule } from '../../../data-access';

@Component({
  selector: 'app-step5-pos-form',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonComponent, ToggleComponent],
  templateUrl: './step5-pos-form.component.html',
})
export class Step5PosFormComponent implements OnDestroy {
  readonly businessId = input.required<number>();
  readonly completed = output<void>();

  protected readonly $completeBusinessSetupStepService = inject(CompleteBusinessSetupStepService);
  private readonly $toast = inject(ToastService);

  protected readonly $isLoading = this.$completeBusinessSetupStepService.$isLoading;
  protected readonly $hasError = this.$completeBusinessSetupStepService.$hasError;
  protected readonly $errorMessage = this.$completeBusinessSetupStepService.$errorMessage;

  protected readonly moduleOptions = [
    { value: EnabledModule.TABLES, label: 'Mesas' },
    { value: EnabledModule.MODIFIERS, label: 'Modificadores' },
    { value: EnabledModule.SERVICE_STAFF, label: 'Personal de servicio' },
    { value: EnabledModule.KITCHEN, label: 'Cocina' },
    { value: EnabledModule.BOOKING, label: 'Reservas' },
    { value: EnabledModule.TYPES_OF_SERVICE, label: 'Tipos de servicio' },
  ];

  private fb = inject(FormBuilder);

  form = this.fb.group({
    waiterEnabled: [false],
    tablesEnabled: [false],
    isServiceStaffRequired: [false],
    enableTooltip: [true],
    transactionEditDays: [30],
    modules: this.fb.group(
      this.moduleOptions.reduce<Record<string, boolean>>(
        (controls, mod) => ({ ...controls, [mod.value]: false }),
        {},
      ),
    ),
  });

  constructor() {
    effect(() => {
      if (this.$isLoading()) {
        this.$toast.show('Guardando paso 5...', 'warning');
      }
      if (this.$completeBusinessSetupStepService.$success()) {
        this.$toast.show('Configuración completada', 'success');
        this.completed.emit();
      }
      if (this.$hasError()) {
        this.$toast.show(this.$errorMessage() ?? 'Algo salió mal. Por favor, vuelva a intentar.', 'error');
      }
    });
  }

  onEnableTooltipChange(checked: boolean) {
    this.form.get('enableTooltip')?.setValue(checked);
  }

  submitForm() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const modules = raw.modules ?? {};

    const enabledModules: string[] = Object.entries(modules)
      .filter(([, enabled]) => enabled)
      .map(([key]) => key);

    const posSettings = {
      waiter_enabled: raw.waiterEnabled ?? false,
      tables_enabled: raw.tablesEnabled ?? false,
      is_service_staff_required: raw.isServiceStaffRequired ?? false,
    };

    this.$completeBusinessSetupStepService.execute(this.businessId(), 5, {
      posSettings,
      keyboardShortcuts: {},
      enableTooltip: raw.enableTooltip ?? false,
      enabledModules,
      transactionEditDays: raw.transactionEditDays ?? 0,
    });
  }

  ngOnDestroy(): void {
    this.$completeBusinessSetupStepService.reset();
  }
}
