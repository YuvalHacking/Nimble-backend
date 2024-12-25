import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvoiceStatus } from '@invoiceStatusEntity';

/**
 * The InvoiceStatusService handles the business logic related to invoice statuses.
 * It provides methods to interact with the currency data in the database, 
 */
@Injectable()
export class InvoiceStatusService {
  private readonly logger = new Logger(InvoiceStatusService.name);

  constructor(
    @InjectRepository(InvoiceStatus)
    private readonly invoiceStatusRepository: Repository<InvoiceStatus>,
  ) {}

  /**
   * Finds an invoice status by its name.
   * 
   * @param {string} name - The name of the invoice status to find.
   * @returns {Promise<InvoiceStatus>} - The found invoice status.
   * @throws Will throw an error if the invoice status is not found.
   */
  async findByName(name: string): Promise<InvoiceStatus> {
    try {
      const invoiceStatus = await this.invoiceStatusRepository.findOne({ where: { name } });

      if (!invoiceStatus) {
        const errorMessage = `Invoice status not found: ${name}`;
        this.logger.error(errorMessage);
        throw new NotFoundException(errorMessage);
      }

      return invoiceStatus;
      
    } catch (err) {
      this.logger.error('Error finding invoice status by name:', err);
      throw new Error('Error finding invoice status by name');
    }
  }

   /**
   * Returns all invoice status values.
   * 
   * @returns {Promise<InvoiceStatus[]>} - The list of all invoice statuses.
   * @throws Will throw an error if there is an issue with the database operation.
   */
   async findAll(): Promise<InvoiceStatus[]> {
    try {
      const invoiceStatuses = await this.invoiceStatusRepository.find();
      this.logger.log('All invoice statuses retrieved successfully');
      return invoiceStatuses;
    } catch (err) {
      this.logger.error('Error retrieving all invoice statuses:', err);
      throw new Error('Error retrieving all invoice statuses');
    }
  }
  
}