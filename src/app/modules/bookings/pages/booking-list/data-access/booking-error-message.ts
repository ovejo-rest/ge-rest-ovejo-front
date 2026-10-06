import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { ApiErrorCode, readApiError } from 'src/app/core/utils';

// Traduce las reglas de negocio del backend por su código; capacidad y personas vienen en `details`.
export function getBookingErrorMessage(error: HttpErrorResponse): string {
  const { code, details } = readApiError(error);
  switch (code) {
    case ApiErrorCode.BOOKING_TABLE_CAPACITY:
      return typeof details['capacity'] === 'number' && typeof details['partySize'] === 'number'
        ? `La mesa es para ${details['capacity']} personas y la reserva es para ${details['partySize']}.`
        : 'La mesa no tiene capacidad para esa cantidad de personas.';
    case ApiErrorCode.BOOKING_OUTSIDE_HOURS:
      return 'La reserva queda fuera del horario de atención.';
    case ApiErrorCode.BOOKING_TABLE_TAKEN:
      return 'La mesa ya tiene una reserva en ese horario.';
    case ApiErrorCode.BOOKING_CONTACT_OVERLAP:
      return 'El cliente ya tiene otra reserva a esa hora.';
    case ApiErrorCode.BOOKING_INVALID_DATES:
      return 'La reserva debe terminar después de empezar.';
  }
  switch (error.status) {
    case HttpStatusCode.BadRequest:
      return 'Revisa los datos de la reserva.';
    case HttpStatusCode.Forbidden:
      return 'No tienes permiso para esta acción.';
    case HttpStatusCode.NotFound:
      // Sin código propio: la mesa no es de la sucursal, o no existen la reserva, el cliente o la sucursal.
      return 'La reserva, el cliente, la mesa o la sucursal no existen.';
    case HttpStatusCode.Conflict:
      return 'No hay disponibilidad para ese horario.';
    default:
      return 'Ocurrió un error inesperado. Intenta nuevamente.';
  }
}
