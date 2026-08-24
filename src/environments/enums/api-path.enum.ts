import { environment } from '../environment';

export const ApiPathEnum = {
  AUTH: `${environment.baseUrl}/auth/api`,
  RESTAURANT: `${environment.baseUrl}/restaurant/api`,
} as const;

export type ApiPathEnum = (typeof ApiPathEnum)[keyof typeof ApiPathEnum];
