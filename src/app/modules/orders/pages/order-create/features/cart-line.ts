import { ProductDto } from 'src/app/modules/products/pages/product-list/data-access';
import { OrderProductDto } from '../data-access';

export type CartLine = Readonly<{
  // Identifica la línea: un mismo producto puede ir en varias líneas con distinta nota.
  key: string;
  productId: number;
  variationId: number;
  name: string;
  unitPrice: number;
  quantity: number;
  // "sin palta", "término medio"…
  note: string;
}>;

export const QUICK_NOTES = ['sin palta', 'sin mayo', 'sin cebolla', 'sin tomate', 'sin sal', 'bien cocido', 'término medio', 'para llevar'];

// Tocar un producto suma 1 a su línea sin nota; si todas tienen nota, abre una línea nueva.
export function addToCart(cart: CartLine[], product: ProductDto): CartLine[] {
  const variation = product.variations[0];
  if (!variation) return cart;
  const plain = cart.find((line) => line.productId === product.id && !line.note);
  if (plain) return cart.map((line) => (line === plain ? { ...line, quantity: line.quantity + 1 } : line));
  return [
    ...cart,
    {
      key: `${product.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      productId: product.id,
      variationId: variation.id,
      name: product.name,
      unitPrice: variation.sellPriceIncTax ?? 0,
      quantity: 1,
      note: '',
    },
  ];
}

export function changeCartQuantity(cart: CartLine[], key: string, delta: number): CartLine[] {
  return cart.map((line) => (line.key === key ? { ...line, quantity: Math.max(1, line.quantity + delta) } : line));
}

export function removeFromCart(cart: CartLine[], key: string): CartLine[] {
  return cart.filter((line) => line.key !== key);
}

export function setCartNote(cart: CartLine[], key: string, note: string): CartLine[] {
  return cart.map((line) => (line.key === key ? { ...line, note: note.trim() } : line));
}

// Cantidad total por producto (para el contador de cada tarjeta del catálogo).
export function quantitiesByProduct(cart: CartLine[]): Record<number, number> {
  return cart.reduce<Record<number, number>>((acc, line) => {
    acc[line.productId] = (acc[line.productId] ?? 0) + line.quantity;
    return acc;
  }, {});
}

export function toOrderProducts(cart: CartLine[]): OrderProductDto[] {
  return cart.map(({ productId, variationId, quantity }) => ({ productId, variationId, quantity }));
}

/**
 * El backend aún no acepta notas por producto (BACKEND-REQUESTS.md): se juntan en la nota del pedido
 * (staffNote), que es la que se imprime en la comanda. Ej.: "1x Completo: sin palta".
 */
export function buildKitchenNote(cart: CartLine[], generalNote: string): string {
  const lines = cart.filter((line) => line.note).map((line) => `${line.quantity}x ${line.name}: ${line.note}`);
  return [...lines, generalNote.trim()].filter(Boolean).join('\n');
}
