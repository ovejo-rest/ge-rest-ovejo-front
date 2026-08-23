export type DashboardMetricsDto = Readonly<{
  todaySales: number;
  todayOrders: number;
  averageTicket: number;
  totalTables: number;
  occupiedTables: number;
  activeProducts: number;
}>;
