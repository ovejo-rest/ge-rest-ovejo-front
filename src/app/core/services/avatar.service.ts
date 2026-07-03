import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AvatarService {
  private readonly baseUrl = 'https://ui-avatars.com/api';

  getAvatarUrl(name: string): string {
    return `${this.baseUrl}?name=${encodeURIComponent(name)}&background=random&bold=true`;
  }
}
