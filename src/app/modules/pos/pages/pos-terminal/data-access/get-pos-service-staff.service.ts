import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, of, Subject, switchMap, tap } from 'rxjs';
import { ApiPathEnum } from 'src/environments';
import { PosServiceStaffDto } from './dtos';

// Meseros de la pantalla de PIN: solo los de la sucursal del POS (y los que no tienen sucursal).
@Injectable({ providedIn: 'root' })
export class GetPosServiceStaffService {
  readonly #httpClient = inject(HttpClient);
  readonly #load$ = new Subject<number>();
  readonly #isLoading$ = new BehaviorSubject(false);

  readonly $isLoading = toSignal(this.#isLoading$, { initialValue: false });

  readonly $staff = toSignal(
    this.#load$.pipe(
      tap(() => this.#isLoading$.next(true)),
      switchMap((locationId) =>
        this.#httpClient
          .get<PosServiceStaffDto[]>(`${ApiPathEnum.RESTAURANT}/pos/service-staff`, {
            params: new HttpParams().set('locationId', locationId),
          })
          .pipe(catchError(() => of<PosServiceStaffDto[]>([]))),
      ),
      tap(() => this.#isLoading$.next(false)),
    ),
    { initialValue: [] as PosServiceStaffDto[] },
  );

  // Siempre consulta de nuevo: un mesero recién creado debe aparecer.
  load(locationId: number) {
    this.#load$.next(locationId);
  }
}
