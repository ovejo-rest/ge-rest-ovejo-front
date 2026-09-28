export type BookingStatus = 'waiting' | 'booked' | 'completed' | 'cancelled';

// Ítem del listado (GET /bookings).
export type BookingDto = Readonly<{
  id: number;
  title: string;
  start: string;
  end: string;
  customerName: string;
  tableName: string | null;
  correspondentName: string | null;
  waiterName: string | null;
  locationName: string;
  status: BookingStatus;
  partySize: number;
}>;

// Detalle (GET /bookings/:id), necesario para editar.
export type BookingDetailDto = Readonly<{
  id: number;
  locationId: number;
  contactId: number;
  customerName: string;
  tableId: number | null;
  tableName: string | null;
  bookingStart: string;
  bookingEnd: string;
  bookingStatus: BookingStatus;
  bookingNote: string | null;
  locationName: string;
  partySize: number;
}>;

export type BookingFiltersDto = Readonly<{
  startDate: string;
  endDate: string;
  locationId?: number;
}>;

export type CreateBookingDto = Readonly<{
  contactId: number;
  locationId: number;
  bookingStart: string;
  bookingEnd?: string;
  tableId?: number;
  partySize?: number;
  bookingNote?: string;
}>;

export type UpdateBookingDto = Readonly<{
  id: number;
  bookingStatus?: BookingStatus;
  partySize?: number;
  bookingStart?: string;
  bookingEnd?: string;
  // null = dejar la reserva sin mesa.
  tableId?: number | null;
  bookingNote?: string;
}>;
