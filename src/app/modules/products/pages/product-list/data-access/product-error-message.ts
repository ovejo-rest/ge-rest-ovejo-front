import { HttpStatusCode } from '@angular/common/http';

export function getProductErrorMessage(status: HttpStatusCode | undefined): string {
  switch (status) {
    case HttpStatusCode.BadRequest:
      return 'Los datos ingresados no son válidos.';
    case HttpStatusCode.Forbidden:
      return 'No tienes permiso para esta acción.';
    case HttpStatusCode.NotFound:
      return 'El producto o la categoría no existen.';
    case HttpStatusCode.Conflict:
      return 'Ya existe un producto con ese SKU o no se puede completar la acción.';
    default:
      return 'Ocurrió un error inesperado. Intenta nuevamente.';
  }
}
