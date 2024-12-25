import { SelectQueryBuilder } from 'typeorm';

/**
 * Applies filters to the invoice query based on the provided parameters.
 * 
 * @param query - The SelectQueryBuilder instance to apply filters to.
 * @param startDate - The start date to filter invoices by date range.
 * @param endDate - The end date to filter invoices by date range.
 * @param supplierIds - An array of supplier IDs to filter invoices by supplier.
 * @param statusId - The status ID to filter invoices by status.
 * @returns The SelectQueryBuilder instance with the applied filters.
 */
export function applyInvoiceFilters<T>(
  query: SelectQueryBuilder<T>,
  startDate?: Date,
  endDate?: Date,
  supplierIds?: string[],
  statusId?: number
): SelectQueryBuilder<T> {
  if (supplierIds && supplierIds.length > 0) {
    query.andWhere('invoice.supplier_internal_id IN (:...supplierIds)', { supplierIds });
  }

  if (startDate && endDate) {
    query.andWhere('invoice.date BETWEEN :startDate AND :endDate', { startDate, endDate });
  }

  if (statusId) {
    query.andWhere('status.id = :statusId', { statusId });
  }

  return query;
}
