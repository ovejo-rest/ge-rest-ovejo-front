import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, OnDestroy, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  BehaviorSubject,
  catchError,
  debounceTime,
  EMPTY,
  filter,
  fromEvent,
  map,
  merge,
  Observable,
  of,
  shareReplay,
  Subject,
  switchMap,
  takeUntil,
  tap,
  timer,
} from 'rxjs';
import { ApiPathEnum } from 'src/environments';
import { WhoamiDto } from './dtos';

const MINUTE = 60_000;

export type SessionUser = Readonly<{
  code: string;
  name: string;
  fatherLastName: string;
  motherLastName: string | null;
  email: string;
  profileImageUrl?: string | null;
}>;

@Injectable({ providedIn: 'root' })
export class WhoamiService implements OnDestroy {
  readonly #httpClient = inject(HttpClient);
  readonly #destroy$ = new Subject<void>();
  readonly #fetchUser$ = new BehaviorSubject<void>(void 0);

  readonly #user$: Observable<WhoamiDto | null> = merge(
    this.#fetchUser$,
    timer(0, MINUTE).pipe(filter(() => document.hasFocus())),
    fromEvent(document, 'visibilitychange').pipe(
      filter(() => document.visibilityState === 'visible' && document.hasFocus()),
      debounceTime(30_000),
    ),
  ).pipe(
    switchMap(() =>
      this.#httpClient.get<WhoamiDto>(`${ApiPathEnum.AUTH}/users/whoami`).pipe(
        tap((whoami) => this.#latest.set(whoami)),
        catchError(() => EMPTY),
        tap(() => localStorage.setItem('lastActivity', String(Date.now()))),
      ),
    ),
    shareReplay({ bufferSize: 1, refCount: true }),
    takeUntil(this.#destroy$),
  );

  // Última respuesta de whoami, venga del refresco periódico o de load(); se borra al cerrar sesión.
  readonly #latest = signal<WhoamiDto | undefined>(undefined);
  readonly $whoami = this.#latest.asReadonly();
  readonly roles$: Observable<Set<string>> = this.#user$.pipe(map((u) => new Set(u?.roles.map((r) => r.code) ?? [])));
  readonly permissions$: Observable<Set<string>> = this.#user$.pipe(map((u) => new Set(u?.permissions ?? [])));
  readonly $permissionsSet = toSignal(this.permissions$, { initialValue: new Set<string>() });
  // Sucursal asignada al usuario (null si no tiene); undefined mientras carga.
  readonly $branchId = computed(() => {
    const whoami = this.$whoami();
    return whoami === undefined ? undefined : whoami?.user.branchId || null;
  });

  constructor() {
    this.#user$.subscribe();
  }

  refetch() {
    this.#fetchUser$.next();
  }

  /**
   * Pide whoami ahora mismo (null si falla). Es la fuente de verdad del restaurantId:
   * no se usa el del JWT porque cambia al crear el negocio.
   */
  load(): Observable<WhoamiDto | null> {
    return this.#httpClient.get<WhoamiDto>(`${ApiPathEnum.AUTH}/users/whoami`).pipe(
      tap((whoami) => this.#latest.set(whoami)),
      catchError(() => of(null)),
    );
  }

  // Adónde ir después de iniciar sesión: sin negocio → onboarding.
  homeRoute(): Observable<string> {
    return this.load().pipe(map((whoami) => (whoami?.user.restaurantId ? '/dashboard/admin' : '/onboarding')));
  }

  forget() {
    this.#latest.set(undefined);
  }

  ngOnDestroy() {
    this.#destroy$.next();
    this.#destroy$.complete();
  }
}
