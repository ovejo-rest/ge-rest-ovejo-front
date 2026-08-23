import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, OnDestroy, output } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent, RutFormatDirective, ToastService } from 'src/ui';
import { CompleteBusinessSetupStepService, SellPriceTax } from '../../../data-access';

@Component({
  selector: 'app-step2-tax-form',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonComponent, RutFormatDirective],
  templateUrl: './step2-tax-form.component.html',
})
export class Step2TaxFormComponent implements OnDestroy {
  readonly businessId = input.required<number>();
  readonly completed = output<void>();

  protected readonly $completeBusinessSetupStepService = inject(CompleteBusinessSetupStepService);
  private readonly $toast = inject(ToastService);

  protected readonly $isLoading = this.$completeBusinessSetupStepService.$isLoading;
  protected readonly $hasError = this.$completeBusinessSetupStepService.$hasError;
  protected readonly $errorMessage = this.$completeBusinessSetupStepService.$errorMessage;

  protected readonly sellPriceTaxOptions = [
    { value: SellPriceTax.INCLUDES, label: 'Incluido' },
    { value: SellPriceTax.EXCLUDES, label: 'Excluido' },
  ];

  private fb = inject(FormBuilder);

  form = this.fb.group({
    taxNumber1: ['', [Validators.required]],
    taxLabel1: [{ value: 'RUT', disabled: true }, [Validators.required]],
    defaultSalesTax: [19, [Validators.required]],
    sellPriceTax: [SellPriceTax.INCLUDES, [Validators.required]],
    codeLabel1: [{ value: 'Cód. de Barra', disabled: true }],
    codeLabel2: [{ value: 'Cód. Proveedor', disabled: true }],
  });

  constructor() {
    effect(() => {
      if (this.$isLoading()) {
        this.$toast.show('Guardando paso 2...', 'warning');
      }
      if (this.$completeBusinessSetupStepService.$success()) {
        this.$toast.show('Paso 2 completado', 'success');
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

    const { taxNumber1, taxLabel1, defaultSalesTax, sellPriceTax, codeLabel1, codeLabel2 } = this.form.getRawValue();

    this.$completeBusinessSetupStepService.execute(this.businessId(), 2, {
      taxNumber1: taxNumber1 ?? '',
      taxLabel1: taxLabel1 ?? '',
      defaultSalesTax: defaultSalesTax ?? 0,
      sellPriceTax: sellPriceTax ?? SellPriceTax.INCLUDES,
      codeLabel1: codeLabel1 ?? undefined,
      codeLabel2: codeLabel2 ?? undefined,
    });
  }

  ngOnDestroy(): void {
    this.$completeBusinessSetupStepService.reset();
  }
}
