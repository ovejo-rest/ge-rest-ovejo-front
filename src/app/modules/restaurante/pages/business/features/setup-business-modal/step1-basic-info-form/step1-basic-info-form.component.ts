import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, OnDestroy, output } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent, ToastService } from 'src/ui';
import { CompleteBusinessSetupStepService } from '../../../data-access';

@Component({
  selector: 'app-step1-basic-info-form',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonComponent],
  templateUrl: './step1-basic-info-form.component.html',
})
export class Step1BasicInfoFormComponent implements OnDestroy {
  readonly businessId = input.required<number>();
  readonly completed = output<void>();

  protected readonly $completeBusinessSetupStepService = inject(CompleteBusinessSetupStepService);
  private readonly $toast = inject(ToastService);

  protected readonly $isLoading = this.$completeBusinessSetupStepService.$isLoading;
  protected readonly $hasError = this.$completeBusinessSetupStepService.$hasError;
  protected readonly $errorMessage = this.$completeBusinessSetupStepService.$errorMessage;

  private fb = inject(FormBuilder);

  form = this.fb.group({
    name: ['', [Validators.required]],
    logo: [''],
  });

  constructor() {
    effect(() => {
      if (this.$isLoading()) {
        this.$toast.show('Guardando paso 1...', 'warning');
      }
      if (this.$completeBusinessSetupStepService.$success()) {
        this.$toast.show('Paso 1 completado', 'success');
        this.completed.emit();
      }
      if (this.$hasError()) {
        this.$toast.show(this.$errorMessage() ?? 'Algo salió mal. Por favor, vuelva a intentar.', 'error');
      }
    });
  }

  submitForm() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, logo } = this.form.getRawValue();

    this.$completeBusinessSetupStepService.execute(this.businessId(), 1, {
      name: name ?? '',
      logo: logo ?? undefined,
    });
  }

  ngOnDestroy(): void {
    this.$completeBusinessSetupStepService.reset();
  }
}
