import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of, Subject, switchMap } from 'rxjs';
import { ApiPathEnum } from 'src/environments';
import { StationDto } from './dtos';

@Injectable({ providedIn: 'root' })
export class GetStationsService {
  readonly #httpClient = inject(HttpClient);
  readonly #load$ = new Subject<void>();

  // El backend convierte isActive con Boolean(): solo se envía "true".
  readonly $stations = toSignal(
    this.#load$.pipe(
      switchMap(() =>
        this.#httpClient
          .get<StationDto[]>(`${ApiPathEnum.RESTAURANT}/stations`, { params: new HttpParams().set('isActive', true) })
          .pipe(catchError(() => of<StationDto[]>([]))),
      ),
    ),
    { initialValue: [] as StationDto[] },
  );

  load() {
    this.#load$.next();
  }
}
