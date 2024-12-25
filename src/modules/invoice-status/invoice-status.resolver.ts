import { Resolver, Query, Args } from '@nestjs/graphql';
import { InvoiceStatusService } from './services/invoice-status.service';
import { InvoiceStatus } from '@invoiceStatusEntity';

/**
 * The InvoiceStatusResolver provides queries for invoice status operations.
 * It fetches invoice statuses related data from from the database.
 */
@Resolver(() => InvoiceStatus)
export class InvoiceStatusResolver {
  constructor(private readonly invoiceStatusService: InvoiceStatusService) {}

  /**
   * Query to get all invoice statuses.
   * 
   * @returns {Promise<InvoiceStatus[]>} - The list of all invoice statuses.
   */
  @Query(() => [InvoiceStatus], { name: 'invoiceStatuses' })
  async getAllInvoiceStatuses(): Promise<InvoiceStatus[]> {
    return this.invoiceStatusService.findAll();
  }
}