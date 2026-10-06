/** system: sigue al dispositivo (prefers-color-scheme). */
export type ThemeMode = 'system' | 'light' | 'dark';

export interface Theme {
  mode: ThemeMode;
  color: string;
  direction: string;
}
