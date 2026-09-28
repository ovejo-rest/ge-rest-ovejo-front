import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { concatMap, from, last, Observable } from 'rxjs';
import { ButtonComponent, ConfirmModalComponent, ConfirmModalData, HeaderDashboardComponent, IconComponent, ToastService } from 'src/ui';
import { GetAllBusinessLocationsService } from 'src/app/modules/restaurante/pages/business-location/data-access';
import { getScheduleErrorMessage, ScheduleDto, SchedulesService } from './data-access';
import { DayScheduleRowComponent, ScheduleRange } from './features';
import { WEEK_DAYS, WeekDay } from './ui';

@Component({
  selector: 'app-schedules',
  standalone: true,
  imports: [HeaderDashboardComponent, ButtonComponent, IconComponent, DayScheduleRowComponent],
  templateUrl: './schedules.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchedulesComponent implements OnInit {
  private readonly dialog = inject(MatDialog);
  private readonly toast = inject(ToastService);
  private readonly schedulesService = inject(SchedulesService);
  private readonly locationsService = inject(GetAllBusinessLocationsService);

  readonly days = WEEK_DAYS;
  readonly today = new Date().getDay();

  // null = horario general del negocio; número = horario propio de una sucursal.
  readonly $locationId = signal<number | null>(null);
  readonly $locations = computed(() => this.locationsService.$locations() ?? []);
  readonly $isLoading = computed(() => (this.schedulesService.$isLoading() ?? false) && !this.schedulesService.$schedules());
  readonly $hasError = computed(() => this.schedulesService.$error() !== undefined);
  readonly $busyDays = signal<ReadonlySet<number>>(new Set());

  readonly $scoped = computed(() =>
    (this.schedulesService.$schedules() ?? []).filter((schedule) => schedule.locationId === this.$locationId()),
  );
  readonly $byDay = computed(() => {
    const map = new Map<number, ScheduleDto[]>();
    for (const schedule of this.$scoped()) map.set(schedule.dayOfWeek, [...(map.get(schedule.dayOfWeek) ?? []), schedule]);
    return map;
  });
  readonly $hasGeneral = computed(() =>
    (this.schedulesService.$schedules() ?? []).some((schedule) => schedule.locationId === null),
  );
  readonly $scopeLabel = computed(() =>
    this.$locationId() === null
      ? 'General del negocio'
      : (this.$locations().find((location) => location.id === this.$locationId())?.name ?? 'Sucursal'),
  );

  ngOnInit(): void {
    this.schedulesService.load();
  }

  selectScope(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.$locationId.set(value ? Number(value) : null);
  }

  handleAdd(day: WeekDay, range: ScheduleRange) {
    this.run(day, this.schedulesService.create({ dayOfWeek: day.dayOfWeek, ...range, locationId: this.$locationId() ?? undefined }));
  }

  handleUpdate(day: WeekDay, { id, ...range }: ScheduleRange & { id: number }) {
    this.run(day, this.schedulesService.update({ id, ...range }));
  }

  handleRemove(day: WeekDay, schedule: ScheduleDto) {
    this.run(day, this.schedulesService.delete(schedule.id));
  }

  handleSetClosed(day: WeekDay, closed: boolean) {
    const schedules = this.$byDay().get(day.dayOfWeek) ?? [];
    if (!closed) {
      const closedRecord = schedules.find((schedule) => schedule.isClosed);
      if (closedRecord) this.run(day, this.schedulesService.delete(closedRecord.id));
      return;
    }

    const ranges = schedules.filter((schedule) => !schedule.isClosed);
    // El backend no permite cerrar un día con tramos: se eliminan primero.
    const markClosed = () =>
      this.run(
        day,
        from(ranges).pipe(
          concatMap((range) => this.schedulesService.delete(range.id)),
          last(null, null),
          concatMap(() =>
            this.schedulesService.create({
              dayOfWeek: day.dayOfWeek,
              openTime: '00:00',
              closeTime: '00:00',
              isClosed: true,
              locationId: this.$locationId() ?? undefined,
            }),
          ),
        ),
      );

    if (!ranges.length) {
      markClosed();
      return;
    }
    this.dialog
      .open<ConfirmModalComponent, ConfirmModalData, boolean>(ConfirmModalComponent, {
        width: '440px',
        maxWidth: '95vw',
        data: {
          title: `Cerrar el ${day.label.toLowerCase()}`,
          message: `Se eliminarán ${ranges.length === 1 ? 'el tramo configurado' : `los ${ranges.length} tramos configurados`} para ese día.`,
          confirmText: 'Cerrar día',
          cancelText: 'Volver',
          tone: 'danger',
        },
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) markClosed();
      });
  }

  handleRetry() {
    this.schedulesService.load();
  }

  private run(day: WeekDay, request: Observable<unknown>) {
    this.setBusy(day.dayOfWeek, true);
    request.subscribe({
      next: () => undefined,
      complete: () => {
        this.setBusy(day.dayOfWeek, false);
        this.schedulesService.load();
      },
      error: (error: HttpErrorResponse) => {
        this.setBusy(day.dayOfWeek, false);
        this.toast.show(getScheduleErrorMessage(error), 'error');
        this.schedulesService.load();
      },
    });
  }

  private setBusy(dayOfWeek: number, busy: boolean) {
    this.$busyDays.update((days) => {
      const next = new Set(days);
      if (busy) next.add(dayOfWeek);
      else next.delete(dayOfWeek);
      return next;
    });
  }
}
