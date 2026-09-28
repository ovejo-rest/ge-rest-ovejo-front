import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiPathEnum } from 'src/environments';
import { CreateCustomerDto, CustomerDto } from './dtos';

@Injectable({ providedIn: 'root' })
export class CreateCustomerService {
  readonly #httpClient = inject(HttpClient);

  create(dto: CreateCustomerDto): Observable<CustomerDto> {
    return this.#httpClient.post<CustomerDto>(`${ApiPathEnum.RESTAURANT}/customers`, dto);
  }

  // Con un teléfono repetido el backend responde 409 con "(id 12, Nombre)" en el mensaje.
  getExistingCustomer(error: HttpErrorResponse): Readonly<{ id: number; name: string }> | null {
    const message: unknown = error.error?.message;
    const text = Array.isArray(message) ? message.join(' ') : String(message ?? '');
    const match = /\(id (\d+),\s*([^)]*)\)/.exec(text);
    return error.status === 409 && match ? { id: Number(match[1]), name: match[2].trim() } : null;
  }
}
