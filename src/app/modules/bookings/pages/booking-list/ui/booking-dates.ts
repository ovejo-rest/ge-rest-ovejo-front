// Fechas locales en formato YYYY-MM-DD (para la URL y los inputs de fecha).
export function toDateKey(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function fromDateKey(key: string): Date {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function addDays(key: string, days: number): string {
  const date = fromDateKey(key);
  date.setDate(date.getDate() + days);
  return toDateKey(date);
}

// La semana empieza el lunes.
export function startOfWeek(key: string): string {
  const date = fromDateKey(key);
  const offset = (date.getDay() + 6) % 7;
  return addDays(key, -offset);
}

// Rango del día o la semana en ISO con zona horaria explícita (inicio y fin en hora local).
export function toIsoRange(fromKey: string, days: number) {
  return {
    startDate: new Date(`${fromKey}T00:00:00`).toISOString(),
    endDate: new Date(`${addDays(fromKey, days - 1)}T23:59:59.999`).toISOString(),
  };
}

export function toIso(dateKey: string, time: string): string {
  return new Date(`${dateKey}T${time}:00`).toISOString();
}

export function timeOf(value: string | Date): string {
  return new Date(value).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', hour12: false });
}

export function dateKeyOf(value: string | Date): string {
  return toDateKey(new Date(value));
}

export function longDate(key: string): string {
  const label = fromDateKey(key).toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' });
  return label.charAt(0).toUpperCase() + label.slice(1);
}
