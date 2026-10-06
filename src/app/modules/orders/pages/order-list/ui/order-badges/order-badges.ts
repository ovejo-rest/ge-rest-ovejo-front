export type BadgeTone = 'green' | 'amber' | 'blue' | 'red' | 'gray';
export type BadgeConfig = Readonly<{ label: string; tone: BadgeTone }>;

export const KITCHEN_STATUS: Record<string, BadgeConfig> = {
  received: { label: 'En cocina', tone: 'amber' },
  cooked: { label: 'Listo', tone: 'blue' },
  served: { label: 'Servido', tone: 'green' },
};

export const ORDER_STATUS: Record<string, BadgeConfig> = {
  ORDERED: { label: 'Abierto', tone: 'blue' },
  FINAL: { label: 'Cerrado', tone: 'green' },
  CANCELLED: { label: 'Cancelado', tone: 'red' },
};

export const PAYMENT_STATUS: Record<string, BadgeConfig> = {
  due: { label: 'Pendiente de pago', tone: 'amber' },
  partial: { label: 'Pago parcial', tone: 'blue' },
  paid: { label: 'Pagado', tone: 'green' },
};
