export const InvoiceStatusEnum = Object.freeze({
    PAID: 'PAID',
    PENDING: 'PENDING',
    OVERDUE: 'OVERDUE',
  });
    
  export const CurrencyEnum = Object.freeze({
    USD: 'USD',
    EUR: 'EUR',
    GBP: 'GBP',
  });

  export const SupplierStatusEnum = Object.freeze({
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
  });

  export const invoiceStatuses = Object.values(InvoiceStatusEnum);

  export const currencies = Object.values(CurrencyEnum);
  
  export const supplierStatuses = Object.values(SupplierStatusEnum);
  
  