import { ChangeDetectionStrategy, Component, computed, DestroyRef, effect, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { map } from 'rxjs';
import { ButtonComponent, EmptyStateComponent, HeaderDashboardComponent, IconComponent } from 'src/ui';
import { GetAllBusinessLocationsService } from 'src/app/modules/restaurante/pages/business-location/data-access';
import { GetAllTablesService } from 'src/app/modules/tables/pages/table-list/data-access';
import {
  GetAllOrdersService,
  getOrderErrorMessage,
  GetServiceStaffService,
  OrderStatus,
  PaymentStatus,
} from './data-access';
import { OrdersTableComponent } from './features';
import { FiltersOrderTableComponent, OrderListFilters, ORDER_STATUS, PAYMENT_STATUS } from './ui';

const PER_PAGE = 10;
const DAY = /^\d{4}-\d{2}-\d{2}$/;

type OrderListQuery = OrderListFilters & Readonly<{ page: number }>;

const EMPTY_FILTERS: Record<keyof OrderListFilters, null> = {
  waiter: null,
  status: null,
  payment: null,
  from: null,
  to: null,
  location: null,
  table: null,
};

// Los filtros viven en la URL: se descartan los valores que el backend rechazaría.
function toQuery(params: ParamMap): OrderListQuery {
  const page = Number(params.get('page'));
  const status = params.get('status');
  const payment = params.get('payment');
  const day = (key: string) => {
    const value = params.get(key);
    return value && DAY.test(value) ? value : null;
  };
  const id = (key: string) => {
    const value = Number(params.get(key));
    return Number.isInteger(value) && value > 0 ? value : null;
  };
  const from = day('from');
  const to = day('to');
  return {
    page: Number.isInteger(page) && page > 0 ? page : 1,
    waiter: params.get('waiter'),
    status: status && status in ORDER_STATUS ? (status as OrderStatus) : null,
    payment: payment && payment in PAYMENT_STATUS ? (payment as PaymentStatus) : null,
    from,
    // Un rango invertido lo rechaza el backend (400): se ignora el "hasta".
    to: from && to && to < from ? null : to,
    location: id('location'),
    table: id('table'),
  };
}

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [
    HeaderDashboardComponent,
    ButtonComponent,
    IconComponent,
    EmptyStateComponent,
    OrdersTableComponent,
    FiltersOrderTableComponent,
  ],
  templateUrl: './order-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderListComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly getAllService = inject(GetAllOrdersService);
  private readonly staffService = inject(GetServiceStaffService);
  private readonly locationsService = inject(GetAllBusinessLocationsService);
  private readonly tablesService = inject(GetAllTablesService);

  readonly $query = toSignal(this.route.queryParamMap.pipe(map(toQuery)), {
    initialValue: toQuery(this.route.snapshot.queryParamMap),
  });
  readonly $filters = computed<OrderListFilters>(() => {
    const { waiter, status, payment, from, to, location, table } = this.$query();
    return { waiter, status, payment, from, to, location, table };
  });
  readonly $locationFilter = computed(() => this.$query().location);

  readonly $staff = this.staffService.$staff;
  readonly $locations = computed(() => this.locationsService.$locations() ?? []);
  // El servicio de mesas es global: solo se usan si corresponden a la sucursal filtrada.
  readonly $tables = computed(() => {
    const tables = this.tablesService.$tables();
    const locationId = this.$locationFilter();
    return locationId && this.tablesService.getCurrentLocationId() === locationId ? tables : [];
  });

  readonly $isLoading = computed(() => this.getAllService.$isLoading() ?? false);
  readonly $response = this.getAllService.$orders;
  readonly $orders = computed(() => this.$response()?.data ?? []);
  readonly $pagination = computed(() => this.$response()?.pagination ?? null);
  readonly $errorMessage = computed(() => {
    const status = this.getAllService.$error();
    return status ? getOrderErrorMessage(status) : null;
  });

  readonly $hasFilters = computed(() => Object.values(this.$filters()).some((value) => value !== null));
  readonly $isEmpty = computed(
    () =>
      !this.$isLoading() &&
      !this.$errorMessage() &&
      !this.$hasFilters() &&
      this.$response() !== undefined &&
      this.$pagination()?.totalItems === 0,
  );

  constructor() {
    // Carga las mesas de la sucursal filtrada para ofrecer el filtro por mesa.
    effect(() => {
      const locationId = this.$locationFilter();
      if (locationId) this.tablesService.setParams(locationId);
    });
  }

  ngOnInit(): void {
    this.staffService.load();

    this.route.queryParamMap
      .pipe(map(toQuery), takeUntilDestroyed(this.destroyRef))
      .subscribe((query) =>
        this.getAllService.load({
          page: query.page,
          perPage: PER_PAGE,
          serviceStaff: query.waiter ?? undefined,
          status: query.status ?? undefined,
          paymentStatus: query.payment ?? undefined,
          dateFrom: query.from ?? undefined,
          dateTo: query.to ?? undefined,
          locationId: query.location ?? undefined,
          resTableId: query.table ?? undefined,
        }),
      );
  }

  // Cualquier cambio de filtro vuelve a la primera página.
  handleFiltersChange(changes: Partial<OrderListFilters>) {
    this.navigate({ ...changes, page: null });
  }

  handleClearFilters() {
    this.navigate({ ...EMPTY_FILTERS, page: null });
  }

  handlePageChange(page: number) {
    this.navigate({ page: page > 1 ? page : null });
  }

  handleRetry() {
    this.getAllService.retry();
  }

  private navigate(queryParams: Record<string, string | number | null>) {
    this.router.navigate([], { relativeTo: this.route, queryParams, queryParamsHandling: 'merge' });
  }
}
