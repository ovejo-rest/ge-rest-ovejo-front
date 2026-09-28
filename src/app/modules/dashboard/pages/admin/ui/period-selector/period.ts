export type PeriodPreset = 'today' | 'yesterday' | '7d' | 'month' | 'custom';

export const PERIOD_PRESETS: ReadonlyArray<{ value: Exclude<PeriodPreset, 'custom'>; label: string }> = [
  { value: 'today', label: 'Hoy' },
  { value: 'yesterday', label: 'Ayer' },
  { value: '7d', label: 'Últimos 7 días' },
  { value: 'month', label: 'Este mes' },
];

const pad = (value: number) => String(value).padStart(2, '0');
export const toDateKey = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

// Rango de fechas (YYYY-MM-DD) del período elegido.
export function periodRange(preset: PeriodPreset, custom?: { from: string; to: string }): { from: string; to: string } {
  const today = new Date();
  const shift = (days: number) => {
    const date = new Date(today);
    date.setDate(date.getDate() + days);
    return toDateKey(date);
  };
  switch (preset) {
    case 'yesterday':
      return { from: shift(-1), to: shift(-1) };
    case '7d':
      return { from: shift(-6), to: shift(0) };
    case 'month':
      return { from: toDateKey(new Date(today.getFullYear(), today.getMonth(), 1)), to: shift(0) };
    case 'custom':
      return custom ?? { from: shift(0), to: shift(0) };
    default:
      return { from: shift(0), to: shift(0) };
  }
}

// Texto del período anterior con el que se compara.
export function comparisonLabel(preset: PeriodPreset): string {
  switch (preset) {
    case 'today':
      return 'vs. ayer';
    case 'yesterday':
      return 'vs. anteayer';
    case '7d':
      return 'vs. 7 días anteriores';
    case 'month':
      return 'vs. período anterior';
    default:
      return 'vs. período anterior';
  }
}
