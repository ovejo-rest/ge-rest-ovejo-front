import { HttpStatusCode } from '@angular/common/http';

export function getOrderErrorMessage(status: HttpStatusCode | undefined): string {
  switch (status) {
    case HttpStatusCode.BadRequest:
      return 'Los datos ingresados no son válidos.';
    case HttpStatusCode.Forbidden:
      return 'No tienes permiso para esta acción.';
    case HttpStatusCode.NotFound:
      return 'El pedido no existe.';
    case HttpStatusCode.Conflict:
      return 'No se puede realizar la acción en el estado actual del pedido.';
    default:
      return 'Ocurrió un error inesperado. Intenta nuevamente.';
  }
}
