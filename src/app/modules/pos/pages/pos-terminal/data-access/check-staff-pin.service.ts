import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiPathEnum } from 'src/environments';
import { CheckStaffPinDto, CheckStaffPinResponseDto } from './dtos';

@Injectable({ providedIn: 'root' })
export class CheckStaffPinService {
  readonly #httpClient = inject(HttpClient);

  // Tras 5 intentos fallidos el backend responde 429 y bloquea al mesero por unos minutos.
  check(dto: CheckStaffPinDto): Observable<CheckStaffPinResponseDto> {
    return this.#httpClient.post<CheckStaffPinResponseDto>(`${ApiPathEnum.RESTAURANT}/pos/check-staff-pin`, dto);
  }
}
