export type CurrencyDto = Readonly<{
  id: number;
  country: string;
  currency: string;
  code: string;
  symbol: string;
  thousandOperator: string;
  decimalSeparator: string;
}>;
