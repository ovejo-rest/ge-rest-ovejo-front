import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiPathEnum } from 'src/environments';

@Injectable({ providedIn: 'root' })
export class UpdateBusinessLogoService {
  readonly #httpClient = inject(HttpClient);

  /** logoFileId: archivo confirmado de la carpeta business_logos; null quita el logo. */
  update(businessId: number, logoFileId: string | null): Observable<void> {
    return this.#httpClient.patch<void>(`${ApiPathEnum.RESTAURANT}/business/${businessId}/settings`, { logoFileId });
  }
}
