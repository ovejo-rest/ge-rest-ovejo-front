import { BookingDetailDto } from '../data-access';

export type BookingModalResult = 'created' | 'updated' | 'cancelled';

export type CreateBookingModalData = Readonly<{ locationId: number; date: string }>;
export type UpdateBookingModalData = Readonly<{ booking: BookingDetailDto }>;
