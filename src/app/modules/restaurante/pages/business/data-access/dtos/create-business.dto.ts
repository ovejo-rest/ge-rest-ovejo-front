export type CreateBusinessDto = Readonly<{
  name: string;
  currencyId: number;
  timeZone?: string;
  dateFormat?: string;
  timeFormat?: string;
}>;
