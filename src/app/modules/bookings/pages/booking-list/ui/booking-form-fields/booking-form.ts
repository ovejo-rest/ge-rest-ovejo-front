import { FormBuilder, Validators } from '@angular/forms';
import { BookingDetailDto, BookingStatus, CreateBookingDto, UpdateBookingDto } from '../../data-access';
import { dateKeyOf, timeOf, toIso } from '../booking-dates';

export const DURATIONS = [60, 90, 120, 150, 180];

export function createBookingForm(fb: FormBuilder, defaults: { date: string; booking?: BookingDetailDto }) {
  const booking = defaults.booking;
  const duration = booking
    ? Math.round((new Date(booking.bookingEnd).getTime() - new Date(booking.bookingStart).getTime()) / 60000)
    : 120;
  return fb.group({
    date: [booking ? dateKeyOf(booking.bookingStart) : defaults.date, [Validators.required]],
    time: [booking ? timeOf(booking.bookingStart) : '20:00', [Validators.required]],
    duration: [DURATIONS.includes(duration) ? duration : 120],
    partySize: [booking?.partySize ?? 2, [Validators.required, Validators.min(1), Validators.max(100)]],
    tableId: [booking?.tableId ?? (null as number | null)],
    note: [booking?.bookingNote ?? ''],
    status: [(booking?.bookingStatus ?? 'booked') as BookingStatus],
  });
}

export type BookingForm = ReturnType<typeof createBookingForm>;

function range(form: BookingForm) {
  const { date, time, duration } = form.getRawValue();
  const start = toIso(date!, time!);
  const end = new Date(new Date(start).getTime() + (duration ?? 120) * 60000).toISOString();
  return { bookingStart: start, bookingEnd: end };
}

export function toCreateBookingDto(form: BookingForm, contactId: number, locationId: number): CreateBookingDto {
  const { partySize, tableId, note } = form.getRawValue();
  return {
    contactId,
    locationId,
    ...range(form),
    partySize: partySize ?? 2,
    tableId: tableId ?? undefined,
    bookingNote: note?.trim() || undefined,
  };
}

export function toUpdateBookingDto(form: BookingForm, original: BookingDetailDto): UpdateBookingDto {
  const { partySize, tableId, note, status } = form.getRawValue();
  const { bookingStart, bookingEnd } = range(form);
  const timeChanged =
    new Date(bookingStart).getTime() !== new Date(original.bookingStart).getTime() ||
    new Date(bookingEnd).getTime() !== new Date(original.bookingEnd).getTime();
  return {
    id: original.id,
    ...(timeChanged && { bookingStart, bookingEnd }),
    ...(partySize !== original.partySize && { partySize: partySize ?? undefined }),
    ...(tableId !== original.tableId && { tableId }),
    ...((note ?? '') !== (original.bookingNote ?? '') && { bookingNote: note ?? '' }),
    ...(status !== original.bookingStatus && { bookingStatus: status ?? undefined }),
  };
}
