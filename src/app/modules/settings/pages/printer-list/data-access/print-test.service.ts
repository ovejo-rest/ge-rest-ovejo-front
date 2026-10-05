import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiPathEnum } from 'src/environments';

@Injectable({ providedIn: 'root' })
export class PrintTestService {
  readonly #httpClient = inject(HttpClient);

  // Encola un ticket de prueba (sin pedido): sale cuando la estación de impresión de esa impresora lo toma.
  printTest(printerId: number): Observable<unknown> {
    return this.#httpClient.post(`${ApiPathEnum.RESTAURANT}/print-jobs/test`, { printerId });
  }
}
