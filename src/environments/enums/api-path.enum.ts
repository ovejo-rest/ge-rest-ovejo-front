import { environment } from '../environment';

export const ApiPathEnum = {
  AUTH: environment.authApiUrl,
  RESTAURANT: environment.restaurantApiUrl,
} as const;

export type ApiPathEnum = (typeof ApiPathEnum)[keyof typeof ApiPathEnum];
