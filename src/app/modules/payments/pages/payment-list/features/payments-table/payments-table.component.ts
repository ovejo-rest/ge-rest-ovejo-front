import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentDto } from '../../data-access/dtos';
import { SkeletonComponent } from 'src/ui';

@Component({
  selector: 'app-payments-table',
  standalone: true,
  imports: [CommonModule, SkeletonComponent],
  templateUrl: './payments-table.component.html',
})
export class PaymentsTableComponent {
  @Input() payments: PaymentDto[] = [];
  @Input() loading = false;

  @Output() cancel = new EventEmitter<PaymentDto>();

  onCancel(payment: PaymentDto) {
    this.cancel.emit(payment);
  }

  formatAmount(amount: number): string {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(amount);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  getMethodLabel(method: string | null): string {
    const labels: Record<string, string> = {
      cash: 'Efectivo',
      debit: 'Débito',
      credit: 'Crédito',
      transfer: 'Transferencia',
      other: 'Otro',
    };
    return method ? labels[method] || method : 'N/A';
  }
}
