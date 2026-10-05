import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiPathEnum } from 'src/environments';

@Injectable({ providedIn: 'root' })
export class MarkOrderCookedService {
  readonly #httpClient = inject(HttpClient);

  // Con estación solo marca las líneas de sus productos (Cocina no termina lo del Bar); sin ella, todo el pedido.
  markCooked(transactionId: number, stationId: number | null): Observable<void> {
    const params = stationId ? new HttpParams().set('stationId', stationId) : undefined;
    return this.#httpClient.put<void>(`${ApiPathEnum.RESTAURANT}/kitchen/${transactionId}/mark-cooked`, {}, { params });
  }
}
