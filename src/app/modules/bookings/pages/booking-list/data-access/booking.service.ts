import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiPathEnum } from 'src/environments';
import { BookingDetailDto, BookingIdDto, CreateBookingDto, UpdateBookingDto } from './dtos';

@Injectable({ providedIn: 'root' })
export class BookingService {
  readonly #httpClient = inject(HttpClient);
  readonly #url = `${ApiPathEnum.RESTAURANT}/bookings`;

  findById(id: number): Observable<BookingDetailDto> {
    return this.#httpClient.get<BookingDetailDto>(`${this.#url}/${id}`);
  }

  create(dto: CreateBookingDto): Observable<BookingIdDto> {
    return this.#httpClient.post<BookingIdDto>(this.#url, dto);
  }

  // Cambiar estado, personas, horario o mesa; el backend vuelve a validar la disponibilidad.
  update({ id, ...changes }: UpdateBookingDto): Observable<BookingIdDto> {
    return this.#httpClient.put<BookingIdDto>(`${this.#url}/${id}`, changes);
  }
}
