import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { ApiErrorCode, readApiError } from 'src/app/core/utils';

const DAYS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

// Traduce las reglas de negocio del backend por su código; los datos del tramo vienen en `details`.
export function getScheduleErrorMessage(error: HttpErrorResponse): string {
  const { code, details } = readApiError(error);
  const day = typeof details['dayOfWeek'] === 'number' ? DAYS[details['dayOfWeek']] : null;
  switch (code) {
    case ApiErrorCode.SCHEDULE_OVERLAP:
      return day && details['openTime'] && details['closeTime']
        ? `Se cruza con el tramo del ${day} ${details['openTime']}–${details['closeTime']}.`
        : 'El horario se cruza con otro tramo.';
    case ApiErrorCode.SCHEDULE_EMPTY_RANGE:
      return 'La hora de apertura y de cierre no pueden ser iguales.';
    case ApiErrorCode.SCHEDULE_DAY_CLOSED:
      return day ? `El ${day} está marcado como cerrado.` : 'Ese día está marcado como cerrado.';
    case ApiErrorCode.SCHEDULE_DAY_HAS_RANGES:
      return day ? `El ${day} tiene tramos: elimínalos antes de cerrarlo.` : 'Ese día tiene tramos: elimínalos antes de cerrarlo.';
  }
  switch (error.status) {
    case HttpStatusCode.Conflict:
      return 'El horario se cruza con otro tramo.';
    case HttpStatusCode.BadRequest:
      return 'Revisa las horas: deben tener el formato HH:MM.';
    case HttpStatusCode.Forbidden:
      return 'No tienes permiso para esta acción.';
    case HttpStatusCode.NotFound:
      return 'El horario o la sucursal no existen.';
    default:
      return 'Ocurrió un error inesperado. Intenta nuevamente.';
  }
}
