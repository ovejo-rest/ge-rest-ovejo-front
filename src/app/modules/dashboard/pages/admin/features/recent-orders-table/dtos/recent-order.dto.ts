export type RecentOrderDto = Readonly<{
  id: number;
  tableName: string;
  total: number;
  status: string;
  itemCount: number;
  createdAt: string;
}>;
