export type KitchenLineDto = Readonly<{
  lineId: number;
  productName: string;
  variationName: string;
  quantity: number;
  resLineOrderStatus: string | null;
}>;

// Comanda pendiente: solo trae las líneas aún por preparar (received).
export type KitchenOrderDto = Readonly<{
  transactionId: number;
  invoiceNo: string;
  tableName: string | null;
  waiterName: string | null;
  orderDate: string;
  lineOrders: KitchenLineDto[];
}>;
