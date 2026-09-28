const currency = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 });
const dateTime = new Intl.DateTimeFormat('es-CL', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
const relative = new Intl.RelativeTimeFormat('es-CL', { numeric: 'auto' });

export function formatCurrency(amount: number | null | undefined): string {
  return amount === null || amount === undefined ? '—' : currency.format(amount);
}

export function formatDateTime(date: string | Date): string {
  return dateTime.format(new Date(date));
}

export function formatRelative(date: string | Date, now = Date.now()): string {
  const minutes = Math.round((new Date(date).getTime() - now) / 60000);
  if (Math.abs(minutes) < 60) return relative.format(minutes, 'minute');
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return relative.format(hours, 'hour');
  return relative.format(Math.round(hours / 24), 'day');
}
