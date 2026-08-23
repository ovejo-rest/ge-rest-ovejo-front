export type BusinessDto = Readonly<{
  id: number;
  name: string;
  currencyId: number;
  ownerId: string;
  timeZone: string;
  dateFormat: string;
  timeFormat: string;
  isActive: boolean;
  startDate: Date;
  createdAt: Date;
  updatedAt: Date;
}>;
