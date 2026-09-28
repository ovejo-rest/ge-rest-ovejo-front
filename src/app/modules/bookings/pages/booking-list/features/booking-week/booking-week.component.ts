import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { BookingDto } from '../../data-access';
import { addDays, dateKeyOf, fromDateKey, timeOf, toDateKey } from '../../ui';

type WeekColumn = Readonly<{ key: string; weekday: string; day: number; isToday: boolean; bookings: BookingDto[] }>;

@Component({
  selector: 'app-booking-week',
  standalone: true,
  templateUrl: './booking-week.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingWeekComponent {
  // Lunes de la semana (YYYY-MM-DD).
  readonly weekStart = input.required<string>();
  readonly bookings = input.required<BookingDto[]>();

  readonly selectDay = output<string>();
  readonly edit = output<BookingDto>();

  readonly timeOf = timeOf;

  readonly $columns = computed<WeekColumn[]>(() => {
    const today = toDateKey(new Date());
    const byDay = new Map<string, BookingDto[]>();
    for (const booking of this.bookings()) {
      if (booking.status === 'cancelled') continue;
      const key = dateKeyOf(booking.start);
      byDay.set(key, [...(byDay.get(key) ?? []), booking]);
    }
    return Array.from({ length: 7 }, (_, index) => {
      const key = addDays(this.weekStart(), index);
      const date = fromDateKey(key);
      return {
        key,
        weekday: date.toLocaleDateString('es-CL', { weekday: 'short' }),
        day: date.getDate(),
        isToday: key === today,
        bookings: byDay.get(key) ?? [],
      };
    });
  });
}
