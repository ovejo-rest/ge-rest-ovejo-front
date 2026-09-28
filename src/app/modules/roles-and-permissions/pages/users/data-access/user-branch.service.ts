import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, switchMap, throwError } from 'rxjs';
import { StandardizedPagination } from 'src/app/core/standarized-response';
import { ApiPathEnum } from 'src/environments';
import { UserDto } from './dtos';

/**
 * Sucursal (branchId) del usuario. El listado de usuarios no la trae y la creación no la acepta
 * (ver BACKEND-REQUESTS.md): se lee del perfil y se guarda con PATCH /users/:code.
 */
@Injectable({ providedIn: 'root' })
export class UserBranchService {
  readonly #httpClient = inject(HttpClient);

  getBranchId(userCode: string): Observable<number | null> {
    return this.#httpClient
      .get<{ branchId?: string | null }>(`${ApiPathEnum.AUTH}/profile/${userCode}/user`)
      .pipe(map(({ branchId }) => (branchId ? Number(branchId) : null)));
  }

  setBranchId(userCode: string, branchId: number): Observable<unknown> {
    return this.#httpClient.patch(`${ApiPathEnum.AUTH}/users/${userCode}`, { branchId });
  }

  // Tras crear un usuario (la creación no devuelve su código), se busca por email para asignarle la sucursal.
  setBranchIdByEmail(email: string, branchId: number): Observable<unknown> {
    const params = new HttpParams().set('page', 1).set('perPage', 5).set('email', email);
    return this.#httpClient.get<StandardizedPagination<UserDto>>(`${ApiPathEnum.AUTH}/users`, { params }).pipe(
      map(({ data }) => data.find((user) => user.email.toLowerCase() === email.toLowerCase())),
      switchMap((user) => (user ? this.setBranchId(user.code, branchId) : throwError(() => new Error('Usuario no encontrado')))),
    );
  }
}
