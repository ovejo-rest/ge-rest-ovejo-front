import { HttpStatusCode } from '@angular/common/http';

export function getPrinterErrorMessage(status: HttpStatusCode | undefined): string {
  switch (status) {
    case HttpStatusCode.BadRequest:
      return 'Revisa los datos: una impresora de red necesita una IP válida y el puerto va de 1 a 65535.';
    case HttpStatusCode.Forbidden:
      return 'No tienes permiso para esta acción.';
    case HttpStatusCode.NotFound:
      return 'La impresora o la sucursal no existen.';
    case HttpStatusCode.Conflict:
      return 'No se puede completar la acción: la impresora está en uso.';
    default:
      return 'Ocurrió un error inesperado. Intenta nuevamente.';
  }
}
