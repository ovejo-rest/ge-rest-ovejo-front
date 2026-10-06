export type DashboardMetricsDto = Readonly<{
  // Período usado, en la zona horaria del negocio; previous = mismo largo, justo antes.
  period: Readonly<{ from: string; to: string; previousFrom: string; previousTo: string; timeZone: string }>;
  sales: Readonly<{
    // Pedidos cerrados del período y del período anterior (today/yesterday quedan como alias).
    current: number;
    previous: number;
    taxAmount: number;
    netSales: number;
    // Dinero recibido en el período (pagos no anulados).
    collected: number;
    tips: number;
  }>;
  // Pedidos no cancelados del período y del anterior; open = sin cerrar.
  orders: Readonly<{ current: number; previous: number; open: number; cancelled: number }>;
  avgTicket: number;
  topProducts: ReadonlyArray<Readonly<{ productId: number; productName: string; quantity: number; revenue: number }>>;
  // Un ítem por día local del período, incluidos los días sin ventas.
  salesByDay: ReadonlyArray<Readonly<{ date: string; sales: number; orders: number }>>;
  salesByCategory: ReadonlyArray<
    Readonly<{ categoryId: number | null; categoryName: string | null; quantity: number; revenue: number }>
  >;
  // Pagos no anulados del período por método (cash, debit, credit, transfer, other).
  paymentsByMethod: ReadonlyArray<Readonly<{ method: string | null; amount: number; count: number }>>;
  // Mesas actuales de la sucursal (o de todo el negocio).
  tables: Readonly<{ total: number; occupied: number }>;
  recentOrders: ReadonlyArray<
    Readonly<{ transactionId: number; invoiceNo: string; tableName: string | null; total: number; status: string; createdAt: string }>
  >;
}>;

export type DashboardFiltersDto = Readonly<{
  // YYYY-MM-DD en la zona horaria del negocio.
  dateFrom: string;
  dateTo: string;
  locationId?: number;
}>;
