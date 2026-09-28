import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, EMPTY, Observable, Subject, switchMap, tap } from 'rxjs';
import { ApiPathEnum } from 'src/environments';
import { CreateScheduleDto, ScheduleDto, UpdateScheduleDto } from './dtos';

@Injectable({ providedIn: 'root' })
export class SchedulesService {
  readonly #httpClient = inject(HttpClient);
  readonly #url = `${ApiPathEnum.RESTAURANT}/schedules`;

  readonly #isLoading$ = new BehaviorSubject(false);
  readonly #error$ = new Subject<HttpStatusCode | undefined>();
  readonly #load$ = new Subject<void>();

  readonly $isLoading = toSignal(this.#isLoading$);
  readonly $error = toSignal(this.#error$);

  // Todos los horarios del negocio (generales y por sucursal); la página filtra por alcance.
  readonly $schedules = toSignal(
    this.#load$.pipe(
      tap(() => this.#isLoading$.next(true)),
      tap(() => this.#error$.next(undefined)),
      switchMap(() =>
        this.#httpClient.get<ScheduleDto[]>(this.#url).pipe(
          tap(() => this.#isLoading$.next(false)),
          catchError((error: HttpErrorResponse) => {
            this.#error$.next(error.status);
            this.#isLoading$.next(false);
            return EMPTY;
          }),
        ),
      ),
    ),
  );

  load() {
    this.#load$.next();
  }

  // Las ediciones son en línea y varias por pantalla: se devuelven como Observable.
  create(dto: CreateScheduleDto): Observable<{ id: number }> {
    return this.#httpClient.post<{ id: number }>(this.#url, dto);
  }

  update({ id, ...changes }: UpdateScheduleDto): Observable<unknown> {
    return this.#httpClient.patch(`${this.#url}/${id}`, changes);
  }

  delete(id: number): Observable<unknown> {
    return this.#httpClient.delete(`${this.#url}/${id}`);
  }
}
