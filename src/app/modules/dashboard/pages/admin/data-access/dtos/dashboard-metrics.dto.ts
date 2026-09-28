export type DashboardMetricsDto = Readonly<{
  // Período usado, en la zona horaria del negocio; previous = mismo largo, justo antes.
  period: Readonly<{ from: string; to: string; previousFrom: string; previousTo: string; timeZone: string }>;
  sales: Readonly<{
    // Pedidos cerrados del período (el backend conserva los nombres today/yesterday).
    today: number;
    yesterday: number;
    taxAmount: number;
    netSales: number;
    // Dinero recibido en el período (pagos no anulados).
    collected: number;
    tips: number;
  }>;
  orders: Readonly<{ today: number; yesterday: number; open: number; cancelled: number }>;
  avgTicket: number;
  topProducts: ReadonlyArray<Readonly<{ productId: number; productName: string; quantity: number; revenue: number }>>;
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
