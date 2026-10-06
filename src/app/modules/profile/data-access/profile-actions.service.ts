import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiPathEnum } from 'src/environments';
import { ChangePasswordDto, SetProfileImageResponseDto, UpdateUserNameDto } from './dtos';

/** Acciones del propio usuario sobre su cuenta. */
@Injectable({ providedIn: 'root' })
export class ProfileActionsService {
  readonly #httpClient = inject(HttpClient);

  /** fileId confirmado de la carpeta profile_images; null quita la foto. */
  setProfileImage(fileId: string | null): Observable<SetProfileImageResponseDto> {
    return this.#httpClient.put<SetProfileImageResponseDto>(`${ApiPathEnum.AUTH}/profile/image`, { fileId });
  }

  /** Solo nombre y apellidos (nunca email ni estado). */
  updateName(userCode: string, changes: UpdateUserNameDto): Observable<unknown> {
    return this.#httpClient.patch(`${ApiPathEnum.AUTH}/users/${userCode}`, changes);
  }

  changePassword(userCode: string, dto: ChangePasswordDto): Observable<unknown> {
    return this.#httpClient.patch(`${ApiPathEnum.AUTH}/auth/change-password/${userCode}`, dto);
  }
}
