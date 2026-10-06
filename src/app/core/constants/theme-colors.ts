/** Colores de marca disponibles (cada uno tiene su paleta clara/oscura en styles.css, [data-theme]). */
export const THEME_COLORS = [
  { name: 'base', label: 'Frambuesa', hex: '#E11D48' },
  { name: 'red', label: 'Rojo', hex: '#CC0033' },
  { name: 'orange', label: 'Naranja', hex: '#EA580C' },
  { name: 'yellow', label: 'Amarillo', hex: '#FACC15' },
  { name: 'green', label: 'Verde', hex: '#22C55E' },
  { name: 'blue', label: 'Azul', hex: '#2490FF' },
  { name: 'violet', label: 'Violeta', hex: '#6E56CF' },
] as const;

export type ThemeColorName = (typeof THEME_COLORS)[number]['name'];

export const DEFAULT_THEME_COLOR: ThemeColorName = 'base';

export function isThemeColor(value: unknown): value is ThemeColorName {
  return THEME_COLORS.some((color) => color.name === value);
}
