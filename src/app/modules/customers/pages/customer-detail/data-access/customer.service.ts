import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiPathEnum } from 'src/environments';
import { CustomerDetailDto, UpdateCustomerDto } from './dtos';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  readonly #httpClient = inject(HttpClient);

  findById(id: number): Observable<CustomerDetailDto> {
    return this.#httpClient.get<CustomerDetailDto>(`${ApiPathEnum.RESTAURANT}/customers/${id}`);
  }

  // Los datos del cliente se editan como contacto.
  update(dto: UpdateCustomerDto): Observable<unknown> {
    return this.#httpClient.put(`${ApiPathEnum.RESTAURANT}/contacts/${dto.id}`, dto);
  }

  // El backend elimina con POST /contacts/:id y el id en el body (ver BACKEND-REQUESTS.md).
  delete(id: number): Observable<unknown> {
    return this.#httpClient.post(`${ApiPathEnum.RESTAURANT}/contacts/${id}`, { id });
  }
}
