import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { interval, map } from 'rxjs';
import { EmptyStateComponent, IconComponent, ToastService } from 'src/ui';
import { readApiError } from 'src/app/core/utils';
import { GetKitchenOrdersService, GetStationsService, KitchenOrderDto, MarkOrderCookedService } from './data-access';
import { KitchenTicketComponent } from './features';

// Sin notificaciones en tiempo real en el backend: se consulta periódicamente.
const REFRESH_MS = 15_000;
const CLOCK_MS = 30_000;

@Component({
  selector: 'app-kitchen-display',
  standalone: true,
  imports: [IconComponent, EmptyStateComponent, KitchenTicketComponent],
  templateUrl: './kitchen-display.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KitchenDisplayComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toast = inject(ToastService);
  private readonly ordersService = inject(GetKitchenOrdersService);
  private readonly stationsService = inject(GetStationsService);
  private readonly markCookedService = inject(MarkOrderCookedService);

  // La estación elegida queda en la URL: cada pantalla (cocina, bar…) guarda la suya como favorito.
  readonly $stationId = toSignal(
    this.route.queryParamMap.pipe(
      map((params) => {
        const id = Number(params.get('station'));
        return Number.isInteger(id) && id > 0 ? id : null;
      }),
    ),
    { initialValue: null },
  );
  readonly $stations = this.stationsService.$stations;
  readonly $orders = computed(() => this.ordersService.$orders() ?? []);
  readonly $hasLoaded = computed(() => this.ordersService.$orders() !== undefined);
  readonly $hasError = computed(() => this.ordersService.$error() !== undefined);
  readonly $updatedAt = this.ordersService.$updatedAt;
  readonly $now = signal(Date.now());
  readonly $busyIds = signal<ReadonlySet<number>>(new Set());
  readonly $isFullscreen = signal(false);

  readonly $itemCount = computed(() =>
    this.$orders().reduce((sum, order) => sum + order.lineOrders.reduce((acc, line) => acc + line.quantity, 0), 0),
  );
  readonly $stationName = computed(
    () => this.$stations().find((station) => station.id === this.$stationId())?.name ?? 'Todas las estaciones',
  );

  ngOnInit(): void {
    this.stationsService.load();
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.refresh());
    interval(REFRESH_MS).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.refresh());
    interval(CLOCK_MS).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.$now.set(Date.now()));
  }

  selectStation(stationId: number | null) {
    this.router.navigate([], { relativeTo: this.route, queryParams: { station: stationId }, queryParamsHandling: 'merge' });
  }

  refresh() {
    this.$now.set(Date.now());
    this.ordersService.load(this.$stationId());
  }

  handleMarkReady(order: KitchenOrderDto) {
    this.setBusy(order.transactionId, true);
    // Con una estación elegida solo se marcan sus líneas; el resto del pedido sigue en las otras pantallas.
    this.markCookedService.markCooked(order.transactionId, this.$stationId()).subscribe({
      next: () => {
        this.setBusy(order.transactionId, false);
        this.toast.show(`${order.tableName ?? order.invoiceNo} listo para servir`, 'success');
        this.refresh();
      },
      error: (error: unknown) => {
        this.setBusy(order.transactionId, false);
        this.toast.show(this.markCookedErrorMessage(error), 'error');
        this.refresh();
      },
    });
  }

  async toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
      this.$isFullscreen.set(!!document.fullscreenElement);
    } catch {
      this.toast.show('El navegador no permite pantalla completa', 'warning');
    }
  }

  formatTime(date: Date | null | undefined): string {
    return date ? date.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '—';
  }

  private markCookedErrorMessage(error: unknown): string {
    switch (readApiError(error).status) {
      case 404:
        return 'La comanda o la estación ya no existen';
      case 409:
        return 'El pedido fue anulado';
      default:
        return 'No se pudo marcar la comanda como lista';
    }
  }

  private setBusy(id: number, busy: boolean) {
    this.$busyIds.update((ids) => {
      const next = new Set(ids);
      if (busy) next.add(id);
      else next.delete(id);
      return next;
    });
  }
}
