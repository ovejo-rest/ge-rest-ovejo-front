import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiPathEnum } from 'src/environments';
import { PendingPrintJobDto, UpdatePrintJobStatusDto } from './dtos';

@Injectable({ providedIn: 'root' })
export class PrintJobsService {
  readonly #httpClient = inject(HttpClient);

  // Reserva las comandas pendientes de una impresora para este equipo (quedan en "printing"), de la más
  // antigua a la más nueva: otro equipo que atienda la misma impresora no las recibe. Si no se informan
  // en 2 minutos, el backend las libera para que otro equipo las tome.
  claim(printerId: number, agentId: string, limit = 10): Observable<PendingPrintJobDto[]> {
    const params = new HttpParams().set('printerId', printerId).set('agentId', agentId).set('limit', limit);
    return this.#httpClient.post<PendingPrintJobDto[]>(`${ApiPathEnum.RESTAURANT}/print-jobs/pending/claim`, {}, { params });
  }

  // printed / failed tras intentar imprimir, o pending para liberar una comanda reservada sin imprimir.
  updateStatus({ id, ...body }: UpdatePrintJobStatusDto): Observable<unknown> {
    return this.#httpClient.patch(`${ApiPathEnum.RESTAURANT}/print-jobs/${id}`, body);
  }
}
