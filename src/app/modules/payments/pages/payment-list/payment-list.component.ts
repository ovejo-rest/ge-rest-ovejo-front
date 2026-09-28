import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs';
import { ButtonComponent, EmptyStateComponent, HeaderDashboardComponent, IconComponent, ToastService } from 'src/ui';
import { GetAllPaymentsService, getPaymentErrorMessage, PaymentDto, PaymentMethod } from './data-access';
import { PaymentsTableComponent, VoidPaymentModalComponent, VoidPaymentResult } from './features';
import { FiltersPaymentTableComponent, PAYMENT_METHODS, PaymentTableFilters } from './ui';

const PER_PAGE = 10;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

type PaymentListQuery = PaymentTableFilters & Readonly<{ page: number }>;

function toQuery(params: ParamMap): PaymentListQuery {
  const page = Number(params.get('page'));
  const method = params.get('method');
  const from = params.get('from');
  const to = params.get('to');
  return {
    page: Number.isInteger(page) && page > 0 ? page : 1,
    method: PAYMENT_METHODS.some((option) => option.value === method) ? (method as PaymentMethod) : null,
    from: from && DATE_PATTERN.test(from) ? from : null,
    to: to && DATE_PATTERN.test(to) ? to : null,
    includeCancelled: params.get('cancelled') === 'true',
  };
}

// Las fechas se envían con zona horaria explícita (inicio y fin del día local).
function toIsoRange(from: string | null, to: string | null) {
  return {
    startDate: from ? new Date(`${from}T00:00:00`).toISOString() : undefined,
    endDate: to ? new Date(`${to}T23:59:59.999`).toISOString() : undefined,
  };
}

@Component({
  selector: 'app-payment-list',
  standalone: true,
  imports: [
    HeaderDashboardComponent,
    ButtonComponent,
    IconComponent,
    EmptyStateComponent,
    PaymentsTableComponent,
    FiltersPaymentTableComponent,
  ],
  templateUrl: './payment-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentListComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialog = inject(MatDialog);
  private readonly toast = inject(ToastService);
  private readonly getAllService = inject(GetAllPaymentsService);

  readonly $query = toSignal(this.route.queryParamMap.pipe(map(toQuery)), {
    initialValue: toQuery(this.route.snapshot.queryParamMap),
  });
  readonly $isLoading = computed(() => this.getAllService.$isLoading() ?? false);
  readonly $response = this.getAllService.$payments;
  readonly $payments = computed(() => this.$response()?.data ?? []);
  readonly $pagination = computed(() => this.$response()?.pagination ?? null);
  readonly $errorMessage = computed(() => {
    const status = this.getAllService.$error();
    return status ? getPaymentErrorMessage(status) : null;
  });

  readonly $hasFilters = computed(() => {
    const { method, from, to, includeCancelled } = this.$query();
    return method !== null || from !== null || to !== null || includeCancelled;
  });
  readonly $isEmpty = computed(
    () =>
      !this.$isLoading() &&
      !this.$errorMessage() &&
      !this.$hasFilters() &&
      this.$response() !== undefined &&
      this.$pagination()?.totalItems === 0,
  );

  ngOnInit(): void {
    this.route.queryParamMap
      .pipe(map(toQuery), takeUntilDestroyed(this.destroyRef))
      .subscribe(({ page, method, from, to, includeCancelled }) =>
        this.getAllService.load({
          page,
          perPage: PER_PAGE,
          method: method ?? undefined,
          includeCancelled,
          ...toIsoRange(from, to),
        }),
      );
  }

  handleFiltersChange(changes: Partial<PaymentTableFilters>) {
    const params: Record<string, string | null> = { page: null };
    if ('method' in changes) params['method'] = changes.method ?? null;
    if ('from' in changes) params['from'] = changes.from ?? null;
    if ('to' in changes) params['to'] = changes.to ?? null;
    if ('includeCancelled' in changes) params['cancelled'] = changes.includeCancelled ? 'true' : null;
    this.navigate(params);
  }

  handleClearFilters() {
    this.navigate({ page: null, method: null, from: null, to: null, cancelled: null });
  }

  handlePageChange(page: number) {
    this.navigate({ page: page > 1 ? String(page) : null });
  }

  handleRetry() {
    this.getAllService.retry();
  }

  handleVoid(payment: PaymentDto) {
    this.dialog
      .open<VoidPaymentModalComponent, PaymentDto, VoidPaymentResult>(VoidPaymentModalComponent, {
        width: '520px',
        maxWidth: '95vw',
        disableClose: true,
        data: payment,
      })
      .afterClosed()
      .subscribe((result) => {
        if (result !== 'voided') return;
        this.toast.show('Pago anulado', 'success');
        this.getAllService.retry();
      });
  }

  private navigate(queryParams: Record<string, string | null>) {
    this.router.navigate([], { relativeTo: this.route, queryParams, queryParamsHandling: 'merge' });
  }
}
