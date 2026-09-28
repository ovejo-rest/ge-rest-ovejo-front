import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';

const DAYS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

// Traduce los mensajes de regla de negocio del backend (vienen en inglés).
export function getScheduleErrorMessage(error: HttpErrorResponse): string {
  const message = String(error.error?.message ?? '');
  if (error.status === HttpStatusCode.Conflict) {
    const clash = /day (\d), (\d{2}:\d{2})-(\d{2}:\d{2})/.exec(message);
    if (clash) return `Se cruza con el tramo del ${DAYS[Number(clash[1])]} ${clash[2]}–${clash[3]}.`;
    if (message.includes('cannot be the same')) return 'La hora de apertura y de cierre no pueden ser iguales.';
    if (message.includes('marked as closed')) return 'Ese día está marcado como cerrado.';
    if (message.includes('already has opening ranges')) return 'Ese día tiene tramos: elimínalos antes de cerrarlo.';
    return 'El horario se cruza con otro tramo.';
  }
  if (error.status === HttpStatusCode.BadRequest) return 'Revisa las horas: deben tener el formato HH:MM.';
  if (error.status === HttpStatusCode.Forbidden) return 'No tienes permiso para esta acción.';
  if (error.status === HttpStatusCode.NotFound) return 'El horario o la sucursal no existen.';
  return 'Ocurrió un error inesperado. Intenta nuevamente.';
}
