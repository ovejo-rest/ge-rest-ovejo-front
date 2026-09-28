import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiPathEnum } from 'src/environments';

@Injectable({ providedIn: 'root' })
export class MarkOrderCookedService {
  readonly #httpClient = inject(HttpClient);

  // Marca como listas todas las líneas pendientes del pedido (ver BACKEND-REQUESTS.md, Cocina).
  markCooked(transactionId: number): Observable<void> {
    return this.#httpClient.put<void>(`${ApiPathEnum.RESTAURANT}/kitchen/${transactionId}/mark-cooked`, {});
  }
}
