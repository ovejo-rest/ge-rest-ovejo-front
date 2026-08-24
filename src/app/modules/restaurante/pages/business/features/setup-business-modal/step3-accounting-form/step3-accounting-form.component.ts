import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, OnDestroy, output } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent, ToastService } from 'src/ui';
import { AccountingMethod, CompleteBusinessSetupStepService, FindAllCurrenciesService } from '../../../data-access';

@Component({
  selector: 'app-step3-accounting-form',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonComponent],
  templateUrl: './step3-accounting-form.component.html',
})
export class Step3AccountingFormComponent implements OnDestroy {
  readonly businessId = input.required<number>();
  readonly completed = output<void>();

  protected readonly $completeBusinessSetupStepService = inject(CompleteBusinessSetupStepService);
  protected readonly $findAllCurrenciesService = inject(FindAllCurrenciesService);
  private readonly $toast = inject(ToastService);

  protected readonly $isLoading = this.$completeBusinessSetupStepService.$isLoading;
  protected readonly $hasError = this.$completeBusinessSetupStepService.$hasError;
  protected readonly $errorMessage = this.$completeBusinessSetupStepService.$errorMessage;

  protected readonly accountingMethodOptions = [
    { value: AccountingMethod.FIFO, label: 'FIFO (Primera entrada, primera salida)' },
    { value: AccountingMethod.LIFO, label: 'LIFO (Última entrada, primera salida)' },
    { value: AccountingMethod.AVCO, label: 'AVCO (Costo promedio)' },
  ];

  private fb = inject(FormBuilder);

  form = this.fb.group({
    defaultProfitPercent: [10, [Validators.required]],
    defaultSalesDiscount: [0, [Validators.required]],
    accountingMethod: [AccountingMethod.FIFO, [Validators.required]],
    currencyPrecision: [2, [Validators.required]],
    quantityPrecision: [2, [Validators.required]],
    purchaseInDiffCurrency: [false],
    purchaseCurrencyId: [null as number | null, [Validators.required]],
    pExchangeRate: [''],
  });

  constructor() {
    this.$findAllCurrenciesService.retry();

    effect(() => {
      if (this.$isLoading()) {
        this.$toast.show('Guardando paso 3...', 'warning');
      }
      if (this.$completeBusinessSetupStepService.$success()) {
        this.$toast.show('Paso 3 completado', 'success');
        this.completed.emit();
      }
      if (this.$hasError()) {
        this.$toast.show(this.$errorMessage() ?? 'Algo salió mal. Por favor, vuelva a intentar.', 'error');
      }
    });
  }

  onPurchaseInDiffCurrencyChange(checked: boolean) {
    this.form.get('purchaseInDiffCurrency')?.setValue(checked);
  }

  submitForm() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const {
      defaultProfitPercent,
      defaultSalesDiscount,
      accountingMethod,
      currencyPrecision,
      quantityPrecision,
      purchaseInDiffCurrency,
      purchaseCurrencyId,
      pExchangeRate,
    } = this.form.getRawValue();

    this.$completeBusinessSetupStepService.execute(this.businessId(), 3, {
      defaultProfitPercent: defaultProfitPercent ?? 0,
      defaultSalesDiscount: defaultSalesDiscount ?? 0,
      accountingMethod: accountingMethod ?? AccountingMethod.FIFO,
      currencyPrecision: currencyPrecision ?? 2,
      quantityPrecision: quantityPrecision ?? 2,
      purchaseInDiffCurrency: purchaseInDiffCurrency ?? false,
      purchaseCurrencyId: purchaseCurrencyId ?? 0,
      pExchangeRate: pExchangeRate === '' ? undefined : Number(pExchangeRate),
    });
  }

  ngOnDestroy(): void {
    this.$completeBusinessSetupStepService.reset();
  }
}
