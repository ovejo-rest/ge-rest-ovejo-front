/**
 * Las URLs de imágenes son firmadas y vencen en 1 hora. Cuando una <img> falla se vuelve a pedir
 * el recurso, como máximo una vez por minuto (evita bucles si la imagen falla por otra razón).
 */
export function throttledRefresh(refresh: () => void, intervalMs = 60_000): () => void {
  let last = 0;
  return () => {
    if (Date.now() - last < intervalMs) return;
    last = Date.now();
    refresh();
  };
}
