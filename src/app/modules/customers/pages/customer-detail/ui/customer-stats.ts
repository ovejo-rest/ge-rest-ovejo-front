import { CustomerRecentOrderDto } from '../data-access';

export type CustomerStats = Readonly<{
  visits: number;
  spent: number;
  averageTicket: number;
  lastVisit: string | null;
}>;

// Se calcula sobre los últimos 20 pedidos que entrega el backend; solo cuentan los pedidos cerrados.
export function computeCustomerStats(orders: CustomerRecentOrderDto[]): CustomerStats {
  const closed = orders.filter((order) => order.status === 'FINAL');
  const spent = closed.reduce((sum, order) => sum + Number(order.total), 0);
  const lastVisit = orders.map((order) => order.createdAt).sort().at(-1) ?? null;
  return {
    visits: closed.length,
    spent,
    averageTicket: closed.length ? Math.round(spent / closed.length) : 0,
    lastVisit,
  };
}
