import { HttpStatusCode } from '@angular/common/http';
import { ApiError, ApiErrorCode } from 'src/app/core/utils';
import { getOrderErrorMessage } from '../../order-list/data-access';

/**
 * Mensaje al crear un pedido o agregar productos. POST /orders/:id/lines responde 409 sin
 * código propio (code CONFLICT) cuando la cuenta ya se cerró o se canceló.
 */
export function getOrderSaveErrorMessage(error: ApiError, adding: boolean): string {
  const notOpen =
    error.code === ApiErrorCode.ORDER_NOT_OPEN || (adding && error.status === HttpStatusCode.Conflict);
  if (notOpen) return 'La cuenta ya no está abierta: no se le pueden agregar productos.';
  return getOrderErrorMessage(error);
}
