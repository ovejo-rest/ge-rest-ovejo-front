import { HttpClient } from '@angular/common/http';
import { inject, Injectable, OnDestroy } from '@angular/core';
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
        catchError(() => EMPTY),
        tap(() => localStorage.setItem('lastActivity', String(Date.now()))),
      ),
    ),
    shareReplay({ bufferSize: 1, refCount: true }),
    takeUntil(this.#destroy$),
  );

  readonly $whoami = toSignal(this.#user$);
  readonly roles$: Observable<Set<string>> = this.#user$.pipe(map((u) => new Set(u?.roles.map((r) => r.code) ?? [])));
  readonly permissions$: Observable<Set<string>> = this.#user$.pipe(map((u) => new Set(u?.permissions ?? [])));
  readonly $permissionsSet = toSignal(this.permissions$, { initialValue: new Set<string>() });

  constructor() {
    this.#user$.subscribe();
  }

  refetch() {
    this.#fetchUser$.next();
  }

  ngOnDestroy() {
    this.#destroy$.next();
    this.#destroy$.complete();
  }
}
