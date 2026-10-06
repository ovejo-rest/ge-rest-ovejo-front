import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, of, Subject, switchMap, tap } from 'rxjs';
import { ApiPathEnum } from 'src/environments';
import { ServiceStaffDto } from './dtos';

@Injectable({ providedIn: 'root' })
export class GetServiceStaffService {
  readonly #httpClient = inject(HttpClient);
  readonly #load$ = new Subject<void>();
  readonly #isLoading$ = new BehaviorSubject(false);
  #loaded = false;

  readonly $isLoading = toSignal(this.#isLoading$, { initialValue: false });

  readonly $staff = toSignal(
    this.#load$.pipe(
      tap(() => this.#isLoading$.next(true)),
      switchMap(() =>
        this.#httpClient
          .get<ServiceStaffDto[]>(`${ApiPathEnum.RESTAURANT}/pos/service-staff`)
          .pipe(catchError(() => of<ServiceStaffDto[]>([]))),
      ),
      tap(() => this.#isLoading$.next(false)),
    ),
    { initialValue: [] as ServiceStaffDto[] },
  );

  // Para selectores (filtros, edición): basta cargarlos una vez por sesión.
  load() {
    if (this.#loaded) return;
    this.refresh();
  }

  // Siempre consulta de nuevo (pantalla de PIN del POS: un mesero recién creado debe aparecer).
  refresh() {
    this.#loaded = true;
    this.#load$.next();
  }
}
