export type PrinterConnection = Readonly<{
  state: 'online' | 'offline' | 'never';
  label: string;
}>;

// La estación de impresión consulta la cola cada pocos segundos y cada consulta actualiza lastSeenAt.
// Con 1 minuto sin noticias se da por desconectada: deja margen para cortes breves de red sin
// esperar demasiado para avisar que nadie está imprimiendo.
const ONLINE_THRESHOLD_MS = 60_000;

export function getPrinterConnection(lastSeenAt: string | null, now: number): PrinterConnection {
  if (!lastSeenAt) return { state: 'never', label: 'Nunca conectada' };
  const elapsed = Math.max(0, now - new Date(lastSeenAt).getTime());
  if (elapsed < ONLINE_THRESHOLD_MS) return { state: 'online', label: 'Conectada' };
  return { state: 'offline', label: `Sin conexión · ${timeAgo(elapsed)}` };
}

function timeAgo(elapsedMs: number): string {
  const minutes = Math.floor(elapsedMs / 60_000);
  if (minutes < 60) return `hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `hace ${hours} h`;
  const days = Math.floor(hours / 24);
  return `hace ${days} ${days === 1 ? 'día' : 'días'}`;
}
