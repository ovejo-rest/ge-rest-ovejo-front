export type OrderStatus = 'received' | 'pending' | 'in_progress' | 'ready' | 'delivered' | 'completed' | 'cancelled';

export type OrderItemDto = Readonly<{
  id: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  notes: string;
}>;

export type OrderDto = Readonly<{
  id: number;
  tableName: string;
  sectorName: string;
  status: OrderStatus;
  itemCount: number;
  subtotal: number;
  total: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItemDto[];
}>;
