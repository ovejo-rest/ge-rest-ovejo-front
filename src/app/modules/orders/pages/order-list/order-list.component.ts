import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { map } from 'rxjs';
import { ButtonComponent, EmptyStateComponent, HeaderDashboardComponent, IconComponent } from 'src/ui';
import { GetAllOrdersService, getOrderErrorMessage, GetServiceStaffService } from './data-access';
import { OrdersTableComponent } from './features';
import { FiltersOrderTableComponent } from './ui';

const PER_PAGE = 10;

type OrderListQuery = Readonly<{ page: number; waiter: string | null }>;

function toQuery(params: ParamMap): OrderListQuery {
  const page = Number(params.get('page'));
  return { page: Number.isInteger(page) && page > 0 ? page : 1, waiter: params.get('waiter') };
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

  readonly $query = toSignal(this.route.queryParamMap.pipe(map(toQuery)), {
    initialValue: toQuery(this.route.snapshot.queryParamMap),
  });
  readonly $staff = this.staffService.$staff;
  readonly $isLoading = computed(() => this.getAllService.$isLoading() ?? false);
  readonly $response = this.getAllService.$orders;
  readonly $orders = computed(() => this.$response()?.data ?? []);
  readonly $pagination = computed(() => this.$response()?.pagination ?? null);
  readonly $errorMessage = computed(() => {
    const status = this.getAllService.$error();
    return status ? getOrderErrorMessage(status) : null;
  });

  readonly $hasFilters = computed(() => this.$query().waiter !== null);
  readonly $isEmpty = computed(
    () =>
      !this.$isLoading() &&
      !this.$errorMessage() &&
      !this.$hasFilters() &&
      this.$response() !== undefined &&
      this.$pagination()?.totalItems === 0,
  );

  ngOnInit(): void {
    this.staffService.load();

    this.route.queryParamMap
      .pipe(map(toQuery), takeUntilDestroyed(this.destroyRef))
      .subscribe(({ page, waiter }) =>
        this.getAllService.load({ page, perPage: PER_PAGE, serviceStaff: waiter ?? undefined }),
      );
  }

  handleWaiterChange(waiter: string | null) {
    this.navigate({ page: null, waiter });
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
