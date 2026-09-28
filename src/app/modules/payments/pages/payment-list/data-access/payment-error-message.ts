import { HttpStatusCode } from '@angular/common/http';

export function getPaymentErrorMessage(status: HttpStatusCode | undefined): string {
  switch (status) {
    case HttpStatusCode.BadRequest:
      return 'Revisa los montos: el pago no puede superar el saldo y el efectivo debe cubrir el monto más la propina.';
    case HttpStatusCode.Forbidden:
      return 'No tienes permiso para esta acción.';
    case HttpStatusCode.NotFound:
      return 'El pedido o el pago no existen.';
    case HttpStatusCode.Conflict:
      return 'El pedido ya no está abierto o el pago ya fue anulado.';
    default:
      return 'Ocurrió un error inesperado. Intenta nuevamente.';
  }
}
