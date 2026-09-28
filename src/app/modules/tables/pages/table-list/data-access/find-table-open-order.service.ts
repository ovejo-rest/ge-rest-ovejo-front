import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, concatMap, filter, first, from, map, Observable, of, switchMap } from 'rxjs';
import { StandardizedPagination } from 'src/app/core/standarized-response';
import { ApiPathEnum } from 'src/environments';
import { TableDto } from './dtos';

type OrderSummary = Readonly<{ transactionId: number; tableName: string | null }>;
type OrderDetail = Readonly<{ transactionId: number; status: string; resTableId: number | null }>;

// Pedidos recientes a revisar y candidatos a verificar por detalle.
const RECENT_ORDERS = 100;
const MAX_CANDIDATES = 5;

/**
 * Workaround mientras GET /tables no expone el pedido abierto de la mesa (BACKEND-REQUESTS.md #2):
 * busca en los pedidos más recientes los de la mesa (por nombre) y verifica en el detalle
 * que esté abierto y que sea de esa misma mesa (por id).
 */
@Injectable({ providedIn: 'root' })
export class FindTableOpenOrderService {
  readonly #httpClient = inject(HttpClient);

  find(table: TableDto): Observable<number | null> {
    const params = new HttpParams().set('page', 1).set('perPage', RECENT_ORDERS);

    return this.#httpClient
      .get<StandardizedPagination<OrderSummary>>(`${ApiPathEnum.RESTAURANT}/orders`, { params })
      .pipe(
        map(({ data }) => data.filter((order) => order.tableName === table.name).slice(0, MAX_CANDIDATES)),
        switchMap((candidates) =>
          from(candidates).pipe(
            concatMap(({ transactionId }) =>
              this.#httpClient.get<OrderDetail>(`${ApiPathEnum.RESTAURANT}/orders/${transactionId}`),
            ),
            filter((order) => order.status === 'ORDERED' && order.resTableId === table.id),
            map((order) => order.transactionId),
            first(null, null),
          ),
        ),
        catchError(() => of(null)),
      );
  }
}
