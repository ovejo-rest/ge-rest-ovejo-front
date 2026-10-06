import { BadgeConfig } from 'src/app/modules/orders/pages/order-list/ui';
import { BookingStatus } from '../data-access';

export const BOOKING_STATUS: Record<BookingStatus, BadgeConfig> = {
  booked: { label: 'Confirmada', tone: 'blue' },
  waiting: { label: 'En espera', tone: 'amber' },
  completed: { label: 'Llegó', tone: 'green' },
  cancelled: { label: 'Cancelada', tone: 'red' },
};

export const BOOKING_STATUS_OPTIONS = (Object.keys(BOOKING_STATUS) as BookingStatus[]).map((value) => ({
  value,
  label: BOOKING_STATUS[value].label,
}));
