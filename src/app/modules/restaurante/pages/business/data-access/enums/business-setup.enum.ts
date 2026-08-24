export const AccountingMethod = {
  FIFO: 'fifo',
  LIFO: 'lifo',
  AVCO: 'avco',
} as const;
export type AccountingMethod = (typeof AccountingMethod)[keyof typeof AccountingMethod];

export const SellPriceTax = {
  INCLUDES: 'includes',
  EXCLUDES: 'excludes',
} as const;
export type SellPriceTax = (typeof SellPriceTax)[keyof typeof SellPriceTax];

export const ExpiryType = {
  ADD_EXPIRY: 'add_expiry',
  ADD_MANUFACTURING: 'add_manufacturing',
} as const;
export type ExpiryType = (typeof ExpiryType)[keyof typeof ExpiryType];

export const OnProductExpiry = {
  KEEP_SELLING: 'keep_selling',
  STOP_SELLING: 'stop_selling',
  AUTO_DELETE: 'auto_delete',
} as const;
export type OnProductExpiry = (typeof OnProductExpiry)[keyof typeof OnProductExpiry];

export const EnabledModule = {
  TABLES: 'tables',
  MODIFIERS: 'modifiers',
  SERVICE_STAFF: 'service_staff',
  KITCHEN: 'kitchen',
  BOOKING: 'booking',
  TYPES_OF_SERVICE: 'types_of_service',
} as const;
export type EnabledModule = (typeof EnabledModule)[keyof typeof EnabledModule];
