// Colores del tema actual para ApexCharts (no entiende var(--...)): se leen de las variables CSS.
export type ChartTheme = Readonly<{ mode: 'light' | 'dark'; primary: string; muted: string; border: string }>;

export function readChartTheme(mode: 'light' | 'dark'): ChartTheme {
  const styles = getComputedStyle(document.documentElement);
  const read = (name: string, fallback: string) => styles.getPropertyValue(name).trim() || fallback;
  return {
    mode,
    primary: read('--primary', '#E11D48'),
    muted: read('--muted-foreground', '#64748B'),
    border: read('--border', '#E2E8F0'),
  };
}

// Montos cortos para los ejes: $12 k, $1,2 M.
export function compactCurrency(value: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}
