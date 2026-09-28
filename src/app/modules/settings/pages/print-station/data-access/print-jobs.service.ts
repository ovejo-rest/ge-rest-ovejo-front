import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiPathEnum } from 'src/environments';
import { PendingPrintJobDto, UpdatePrintJobStatusDto } from './dtos';

@Injectable({ providedIn: 'root' })
export class PrintJobsService {
  readonly #httpClient = inject(HttpClient);

  // Comandas pendientes de una impresora, de la más antigua a la más nueva.
  findPending(printerId: number, limit = 10): Observable<PendingPrintJobDto[]> {
    const params = new HttpParams().set('printerId', printerId).set('limit', limit);
    return this.#httpClient.get<PendingPrintJobDto[]>(`${ApiPathEnum.RESTAURANT}/print-jobs/pending`, { params });
  }

  // printed / failed tras intentar imprimir.
  updateStatus({ id, ...body }: UpdatePrintJobStatusDto): Observable<unknown> {
    return this.#httpClient.patch(`${ApiPathEnum.RESTAURANT}/print-jobs/${id}`, body);
  }
}
