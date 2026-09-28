export type WeekDay = Readonly<{ dayOfWeek: number; label: string; short: string }>;

// Semana empezando el lunes; el backend usa 0 = domingo.
export const WEEK_DAYS: WeekDay[] = [
  { dayOfWeek: 1, label: 'Lunes', short: 'Lun' },
  { dayOfWeek: 2, label: 'Martes', short: 'Mar' },
  { dayOfWeek: 3, label: 'Miércoles', short: 'Mié' },
  { dayOfWeek: 4, label: 'Jueves', short: 'Jue' },
  { dayOfWeek: 5, label: 'Viernes', short: 'Vie' },
  { dayOfWeek: 6, label: 'Sábado', short: 'Sáb' },
  { dayOfWeek: 0, label: 'Domingo', short: 'Dom' },
];

export const hhmm = (time: string) => time.slice(0, 5);

// Un tramo que cierra antes (o a la misma hora) de abrir termina al día siguiente.
export const crossesMidnight = (open: string, close: string) => hhmm(close) <= hhmm(open);
