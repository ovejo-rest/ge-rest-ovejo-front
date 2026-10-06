import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiPathEnum } from 'src/environments';
import { StationProductDto } from './dtos';

// Productos que imprime cada estación. Un producto puede estar en varias estaciones.
@Injectable({ providedIn: 'root' })
export class StationProductsService {
  readonly #httpClient = inject(HttpClient);

  findAll(stationId: number): Observable<StationProductDto[]> {
    return this.#httpClient.get<StationProductDto[]>(`${ApiPathEnum.RESTAURANT}/stations/${stationId}/products`);
  }

  assign(stationId: number, productId: number): Observable<unknown> {
    return this.#httpClient.post(`${ApiPathEnum.RESTAURANT}/stations/${stationId}/products`, { productId });
  }

  remove(stationId: number, productId: number): Observable<unknown> {
    return this.#httpClient.delete(`${ApiPathEnum.RESTAURANT}/stations/${stationId}/products/${productId}`);
  }
}
