import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { IconComponent } from 'src/ui';
import { StatusBadgeComponent } from 'src/app/modules/orders/pages/order-list/ui';
import { BookingDto, BookingStatus } from '../../data-access';
import { BOOKING_STATUS, timeOf } from '../../ui';

export type BookingStatusChange = Readonly<{ booking: BookingDto; status: BookingStatus }>;

@Component({
  selector: 'app-booking-agenda',
  standalone: true,
  imports: [IconComponent, StatusBadgeComponent],
  templateUrl: './booking-agenda.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingAgendaComponent {
  readonly bookings = input.required<BookingDto[]>();
  readonly busyIds = input<ReadonlySet<number>>(new Set());

  readonly edit = output<BookingDto>();
  readonly changeStatus = output<BookingStatusChange>();

  readonly statusMap = BOOKING_STATUS;
  readonly timeOf = timeOf;

  readonly $active = computed(() => this.bookings().filter((booking) => booking.status !== 'cancelled'));
  readonly $cancelled = computed(() => this.bookings().filter((booking) => booking.status === 'cancelled'));
  readonly $guests = computed(() => this.$active().reduce((sum, booking) => sum + booking.partySize, 0));
}
