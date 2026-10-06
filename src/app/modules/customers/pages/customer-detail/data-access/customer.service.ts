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

  // Los datos del cliente se editan como contacto; el id va solo en la URL.
  update(id: number, changes: UpdateCustomerDto): Observable<unknown> {
    return this.#httpClient.put(`${ApiPathEnum.RESTAURANT}/contacts/${id}`, changes);
  }

  delete(id: number): Observable<unknown> {
    return this.#httpClient.delete(`${ApiPathEnum.RESTAURANT}/contacts/${id}`);
  }
}
