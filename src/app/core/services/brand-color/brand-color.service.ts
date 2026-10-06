import { HttpClient } from '@angular/common/http';
import { effect, inject, Injectable, untracked } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { ApiPathEnum } from 'src/environments';
import { ThemeColorName } from '../../constants/theme-colors';
import { ThemeService } from '../theme.service';
import { WhoamiService } from '../whoami/whoami.service';

type BusinessSettingsColorDto = Readonly<{ themeColor?: string | null }>;

// Respaldo por restaurante mientras el backend no expone themeColor (BACKEND-REQUESTS #30).
const localKey = (restaurantId: number) => `redom.brand-color.${restaurantId}`;

/**
 * Color de marca del restaurante: se lee de la configuración del negocio al conocer el restaurantId
 * y se aplica a toda la app (ThemeService).
 */
@Injectable({ providedIn: 'root' })
export class BrandColorService {
  readonly #http = inject(HttpClient);
  readonly #theme = inject(ThemeService);
  readonly #whoami = inject(WhoamiService);
  #loadedFor: number | null = null;

  constructor() {
    effect(() => {
      const restaurantId = this.#whoami.$whoami()?.user.restaurantId ?? null;
      if (!restaurantId || restaurantId === this.#loadedFor) return;
      this.#loadedFor = restaurantId;
      untracked(() => this.#load(restaurantId).subscribe((color) => this.#theme.setBrandColor(color)));
    });
  }

  /** Guarda el color del restaurante y lo aplica al instante. */
  save(restaurantId: number, color: ThemeColorName): Observable<void> {
    return this.#http
      .patch<void>(`${ApiPathEnum.RESTAURANT}/business/${restaurantId}/settings`, { themeColor: color })
      .pipe(
        tap(() => {
          localStorage.setItem(localKey(restaurantId), color);
          this.#theme.setBrandColor(color);
        }),
      );
  }

  #load(restaurantId: number): Observable<string | null> {
    const local = localStorage.getItem(localKey(restaurantId));
    return this.#http.get<BusinessSettingsColorDto>(`${ApiPathEnum.RESTAURANT}/business/${restaurantId}/settings`).pipe(
      map((settings) => settings.themeColor ?? local),
      catchError(() => of(local)),
    );
  }
}
