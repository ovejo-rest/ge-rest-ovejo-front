export type ScheduleDto = Readonly<{
  id: number;
  businessId: number;
  // null = horario general del negocio.
  locationId: number | null;
  // 0 = domingo … 6 = sábado.
  dayOfWeek: number;
  // HH:MM o HH:MM:SS; si cierra antes de abrir, el tramo pasa la medianoche.
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}>;

export type CreateScheduleDto = Readonly<{
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  locationId?: number;
  isClosed?: boolean;
}>;

export type UpdateScheduleDto = Readonly<{
  id: number;
  openTime?: string;
  closeTime?: string;
}>;
