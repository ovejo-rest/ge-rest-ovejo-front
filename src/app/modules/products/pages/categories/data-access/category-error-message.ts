import { HttpStatusCode } from '@angular/common/http';

export function getCategoryErrorMessage(status: HttpStatusCode | undefined): string {
  switch (status) {
    case HttpStatusCode.BadRequest:
      return 'Los datos ingresados no son válidos.';
    case HttpStatusCode.Forbidden:
      return 'No tienes permisos para realizar esta acción.';
    case HttpStatusCode.NotFound:
      return 'La categoría no existe o fue eliminada.';
    case HttpStatusCode.Conflict:
      return 'Ya existe una categoría con esos datos o tiene elementos asociados.';
    default:
      return 'Ocurrió un error inesperado. Intenta nuevamente.';
  }
}
