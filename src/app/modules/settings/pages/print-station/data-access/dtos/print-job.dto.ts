export type PrintJobStatus = 'pending' | 'printed' | 'failed';

// Todo lo necesario para imprimir una comanda (GET /print-jobs/pending).
export type PendingPrintJobDto = Readonly<{
  id: number;
  printerId: number;
  stationId: number | null;
  stationName: string | null;
  attempts: number;
  createdAt: string;
  transactionId: number | null;
  invoiceNo: string | null;
  tableName: string | null;
  waiterName: string | null;
  staffNote: string | null;
  items: ReadonlyArray<{
    productName: string | null;
    variationName: string | null;
    quantity: number | null;
    notes: string | null;
  }>;
}>;

export type UpdatePrintJobStatusDto = Readonly<{
  id: number;
  status: PrintJobStatus;
  errorMessage?: string;
}>;
