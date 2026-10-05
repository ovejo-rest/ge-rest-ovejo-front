const STORAGE_KEY = 'redom.print-agent-id';

let memoryId: string | null = null;

// Identificador estable de este navegador como agente de impresión: el backend lo usa para saber
// qué equipo reservó cada comanda. Sin almacenamiento, dura hasta recargar la página.
export function getPrintAgentId(): string {
  memoryId ??= readStoredId() ?? newUuid();
  try {
    localStorage.setItem(STORAGE_KEY, memoryId);
  } catch {
    // Sin almacenamiento se usa el id en memoria.
  }
  return memoryId;
}

function readStoredId(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

// crypto.randomUUID solo existe en contextos seguros (https/localhost); una tablet en la red local puede no tenerlo.
function newUuid(): string {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
