import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiPathEnum } from 'src/environments';
import { BookingDetailDto, CreateBookingDto, UpdateBookingDto } from './dtos';

@Injectable({ providedIn: 'root' })
export class BookingService {
  readonly #httpClient = inject(HttpClient);
  readonly #url = `${ApiPathEnum.RESTAURANT}/bookings`;

  findById(id: number): Observable<BookingDetailDto> {
    return this.#httpClient.get<BookingDetailDto>(`${this.#url}/${id}`);
  }

  create(dto: CreateBookingDto): Observable<unknown> {
    return this.#httpClient.post(this.#url, dto);
  }

  // Cambiar estado, personas, horario o mesa; el backend vuelve a validar la disponibilidad.
  update({ id, ...changes }: UpdateBookingDto): Observable<unknown> {
    return this.#httpClient.put(`${this.#url}/${id}`, changes);
  }
}
