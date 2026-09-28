export type CustomerRecentOrderDto = Readonly<{
  transactionId: number;
  invoiceNo: string;
  total: number;
  // ORDERED | FINAL | CANCELLED
  status: string;
  createdAt: string;
}>;

export type CustomerDetailDto = Readonly<{
  id: number;
  name: string;
  mobile: string;
  email: string | null;
  taxNumber: string | null;
  addressLine1: string | null;
  city: string | null;
  createdAt: string;
  // Últimos 20 pedidos.
  recentOrders: CustomerRecentOrderDto[];
}>;

export type UpdateCustomerDto = Readonly<{
  id: number;
  name?: string;
  mobile?: string;
  email?: string;
  taxNumber?: string;
  addressLine1?: string;
  city?: string;
}>;
