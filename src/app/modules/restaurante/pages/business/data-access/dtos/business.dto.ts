export type BusinessDto = Readonly<{
  id: number;
  name: string;
  currencyId: number;
  ownerId: string;
  timeZone: string;
  dateFormat: string;
  timeFormat: string;
  isActive: boolean;
  // URL firmada (vence en 1 hora).
  logoUrl?: string | null;
  startDate: Date;
  createdAt: Date;
  updatedAt: Date;
}>;
