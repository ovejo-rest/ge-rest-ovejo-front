import { Component, inject, OnInit, OnDestroy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { HeaderDashboardComponent, ButtonComponent, IconComponent, ToastService } from 'src/ui';
import { PaymentsTableComponent, CreatePaymentModalComponent, CancelPaymentModalComponent } from './features';
import { FiltersPaymentTableComponent } from './ui';
import { GetAllPaymentsService, CreatePaymentService, CancelPaymentService, PaymentDto } from './data-access';

@Component({
  selector: 'app-payment-list',
  standalone: true,
  imports: [
    CommonModule,
    HeaderDashboardComponent,
    ButtonComponent,
    IconComponent,
    PaymentsTableComponent,
    FiltersPaymentTableComponent,
  ],
  templateUrl: './payment-list.component.html',
})
export class PaymentListComponent implements OnInit, OnDestroy {
  private readonly dialog = inject(MatDialog);
  private readonly toastService = inject(ToastService);
  private readonly getAllPaymentsService = inject(GetAllPaymentsService);
  private readonly createPaymentService = inject(CreatePaymentService);
  private readonly cancelPaymentService = inject(CancelPaymentService);

  readonly $payments = this.getAllPaymentsService.$payments;
  readonly $isLoading = this.getAllPaymentsService.$isLoading;
  readonly $hasError = this.getAllPaymentsService.$hasError;

  private currentFilters: {
    transactionId?: number;
    method?: string;
    startDate?: string;
    endDate?: string;
  } = {};

  constructor() {
    effect(() => {
      if (this.createPaymentService.$success()) {
        this.toastService.show('Pago creado exitosamente', 'success');
        this.getAllPaymentsService.retry(this.currentFilters);
      }
    });

    effect(() => {
      if (this.cancelPaymentService.$success()) {
        this.toastService.show('Pago cancelado exitosamente', 'success');
        this.getAllPaymentsService.retry(this.currentFilters);
      }
    });

    effect(() => {
      if (this.createPaymentService.$hasError()) {
        this.toastService.show('Error al crear el pago', 'error');
      }
    });

    effect(() => {
      if (this.cancelPaymentService.$hasError()) {
        this.toastService.show('Error al cancelar el pago', 'error');
      }
    });
  }

  ngOnInit() {
    this.getAllPaymentsService.retry();
  }

  ngOnDestroy() {
    this.createPaymentService.reset();
    this.cancelPaymentService.reset();
  }

  onCreatePayment() {
    this.dialog.open(CreatePaymentModalComponent, {
      width: '500px',
      disableClose: false,
    });
  }

  onCancelPayment(payment: PaymentDto) {
    this.dialog.open(CancelPaymentModalComponent, {
      width: '500px',
      data: payment,
      disableClose: false,
    });
  }

  onFiltersChange(filters: { method?: string; startDate?: string; endDate?: string }) {
    this.currentFilters = filters;
    this.getAllPaymentsService.retry(filters);
  }

  onRetry() {
    this.getAllPaymentsService.retry(this.currentFilters);
  }
}
