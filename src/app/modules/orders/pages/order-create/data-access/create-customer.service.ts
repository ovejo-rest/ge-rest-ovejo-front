import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiPathEnum } from 'src/environments';
import { CreateCustomerDto, CustomerDto } from './dtos';
import { ApiErrorCode, readApiError } from 'src/app/core/utils';

@Injectable({ providedIn: 'root' })
export class CreateCustomerService {
  readonly #httpClient = inject(HttpClient);

  create(dto: CreateCustomerDto): Observable<CustomerDto> {
    return this.#httpClient.post<CustomerDto>(`${ApiPathEnum.RESTAURANT}/customers`, dto);
  }

  // Teléfono repetido: 409 CUSTOMER_PHONE_EXISTS con { customerId, name } en details.
  getExistingCustomer(error: HttpErrorResponse): Readonly<{ id: number; name: string }> | null {
    const { code, details } = readApiError(error);
    if (code !== ApiErrorCode.CUSTOMER_PHONE_EXISTS || details['customerId'] == null) return null;
    return { id: Number(details['customerId']), name: String(details['name'] ?? '') };
  }
}
