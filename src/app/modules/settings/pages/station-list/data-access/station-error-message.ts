import { HttpStatusCode } from '@angular/common/http';

export function getStationErrorMessage(status: HttpStatusCode | undefined): string {
  switch (status) {
    case HttpStatusCode.BadRequest:
      return 'Revisa los datos de la estación.';
    case HttpStatusCode.Forbidden:
      return 'No tienes permiso para esta acción.';
    case HttpStatusCode.NotFound:
      return 'La estación, la impresora o el producto no existen.';
    case HttpStatusCode.Conflict:
      return 'El producto ya está asignado a esta estación.';
    default:
      return 'Ocurrió un error inesperado. Intenta nuevamente.';
  }
}
