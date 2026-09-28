import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';

// Traduce las reglas de negocio del backend (vienen en inglés).
export function getBookingErrorMessage(error: HttpErrorResponse): string {
  const raw = error.error?.message;
  const message = Array.isArray(raw) ? raw.join(' ') : String(raw ?? '');
  const capacity = /seats (\d+) people and the booking is for (\d+)/.exec(message);
  if (capacity) return `La mesa es para ${capacity[1]} personas y la reserva es para ${capacity[2]}.`;
  if (message.includes('outside the opening hours')) return 'La reserva queda fuera del horario de atención.';
  if (message.includes('table already has an overlapping')) return 'La mesa ya tiene una reserva en ese horario.';
  if (message.includes('contact already has an overlapping')) return 'El cliente ya tiene otra reserva a esa hora.';
  if (message.includes('end after it starts')) return 'La reserva debe terminar después de empezar.';
  if (message.includes('Table not found')) return 'La mesa no pertenece a esa sucursal.';
  switch (error.status) {
    case HttpStatusCode.BadRequest:
      return 'Revisa los datos de la reserva.';
    case HttpStatusCode.Forbidden:
      return 'No tienes permiso para esta acción.';
    case HttpStatusCode.NotFound:
      return 'La reserva, el cliente o la sucursal no existen.';
    case HttpStatusCode.Conflict:
      return 'No hay disponibilidad para ese horario.';
    default:
      return 'Ocurrió un error inesperado. Intenta nuevamente.';
  }
}
