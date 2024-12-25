import { supplierStatuses, invoiceStatuses, currencies } from "../constants";

export type SupplierStatus = typeof supplierStatuses[number];
export type InvoiceStatus = typeof invoiceStatuses[number];
export type Currency = typeof currencies[number];

export interface InvoiceRow {
    invoice_id: string;
    invoice_date: string;
    invoice_due_date: string;
    invoice_cost: number;
    invoice_currency: Currency;
    invoice_status: InvoiceStatus;
    supplier_internal_id: string;
    supplier_external_id: string;
    supplier_company_name: string;
    supplier_address: string;
    supplier_city: string;
    supplier_country: string;
    supplier_contact_name: string;
    supplier_phone: string;
    supplier_email: string;
    supplier_bank_code: string;
    supplier_bank_branch_code: string;
    supplier_bank_account_number: number;
    supplier_status: SupplierStatus;
    supplier_stock_value: number;
    supplier_withholding_tax: number;
  }  
  