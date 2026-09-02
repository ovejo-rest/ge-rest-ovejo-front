import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from 'src/ui';
import { PaymentMethod } from '../../data-access';

@Component({
  selector: 'app-filters-payment-table',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  templateUrl: './filters-payment-table.component.html',
})
export class FiltersPaymentTableComponent {
  @Output() filtersChange = new EventEmitter<{
    method?: string;
    startDate?: string;
    endDate?: string;
  }>();

  readonly paymentMethods = Object.values(PaymentMethod);

  form = this.fb.group({
    method: [''],
    startDate: [''],
    endDate: [''],
  });

  constructor(private readonly fb: FormBuilder) {}

  onApply() {
    const value = this.form.getRawValue();
    this.filtersChange.emit({
      method: value.method || undefined,
      startDate: value.startDate || undefined,
      endDate: value.endDate || undefined,
    });
  }

  onClear() {
    this.form.reset({
      method: '',
      startDate: '',
      endDate: '',
    });
    this.filtersChange.emit({});
  }

  getMethodLabel(method: string): string {
    const labels: Record<string, string> = {
      cash: 'Efectivo',
      debit: 'Débito',
      credit: 'Crédito',
      transfer: 'Transferencia',
      other: 'Otro',
    };
    return labels[method] || method;
  }
}
