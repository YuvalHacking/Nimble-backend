import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { InvoiceStatus } from '@invoiceStatusEntity';
import { invoiceStatuses } from '@common/constants';

/**
 * The InvoiceStatusSeederService is responsible for seeding invoice status data into the database. 
 * It checks if predefined invoice statuses exist and adds them to the database if they do not.
 */
@Injectable()
export class InvoiceStatusSeederService {
  private readonly logger = new Logger(InvoiceStatusSeederService.name);

  constructor(
    @InjectRepository(InvoiceStatus)
    private readonly invoiceStatusRepository: Repository<InvoiceStatus>,
  ) {}

  /**
   * Seeds the database with invoice statuses if they do not already exist.
   * 
   * @returns {Promise<void>} - Resolves when seeding is complete.
   * @throws Will throw an error if there is an issue with the database operation.
   */
  async seedInvoiceStatuses(): Promise<void> {
    try {
      for (const status of invoiceStatuses) {
        const existingStatus = await this.invoiceStatusRepository.findOne({ where: { name: status } });
        if (!existingStatus) {
          await this.invoiceStatusRepository.save({ name: status });
          this.logger.log(`Invoice status "${status}" seeded successfully`);
        }
      }
      this.logger.log('Invoice statuses seeded successfully');
    } catch (err) {
      this.logger.error('Error seeding invoice statuses:', err);
      throw new Error('Error seeding invoice statuses');
    }
  }
}