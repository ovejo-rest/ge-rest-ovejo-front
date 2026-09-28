import { toDataURL } from 'qrcode';

// PNG en alta resolución para que se imprima nítido.
export function createQrDataUrl(value: string, width = 512): Promise<string> {
  return toDataURL(value, { width, margin: 1, errorCorrectionLevel: 'M' });
}

export type PrintableTableQr = Readonly<{ name: string; detail: string; url: string }>;

// Abre una hoja imprimible con los QR de las mesas (una tarjeta por mesa).
export async function printTableQrs(tables: PrintableTableQr[], businessName = 'Escanea para ver la carta') {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return false;
  const cards = await Promise.all(
    tables.map(async (table) => {
      const image = await createQrDataUrl(table.url);
      return `<div class="card"><img src="${image}" alt="QR ${escapeHtml(table.name)}" /><h2>${escapeHtml(table.name)}</h2><p>${escapeHtml(table.detail)}</p></div>`;
    }),
  );
  printWindow.document.write(`<!doctype html><html lang="es"><head><meta charset="utf-8"><title>QR de mesas</title>
<style>
  body { font-family: system-ui, sans-serif; margin: 16px; color: #111; }
  header { text-align: center; margin-bottom: 16px; }
  .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .card { border: 1px dashed #999; border-radius: 12px; padding: 16px; text-align: center; break-inside: avoid; }
  .card img { width: 100%; max-width: 200px; }
  .card h2 { margin: 8px 0 4px; font-size: 20px; }
  .card p { margin: 0; color: #555; font-size: 12px; }
  @media print { header { display: none; } }
</style></head><body><header>${escapeHtml(businessName)}</header><div class="grid">${cards.join('')}</div>
<script>window.onload = () => { window.print(); };</script></body></html>`);
  printWindow.document.close();
  return true;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!);
}
