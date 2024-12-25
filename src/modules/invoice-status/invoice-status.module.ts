import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {InvoiceStatusResolver} from './invoice-status.resolver';
import { InvoiceStatusService } from './services/invoice-status.service';
import { InvoiceStatusSeederService} from './services/invoice-status-seeder.service';
import { InvoiceStatus } from '@invoiceStatusEntity';

/**
 * The InvoiceStatusModule manages invoice status operations.
 * It provides the InvoiceStatusService for handling business logic
 * and populating the database with initial data.
 */
@Module({
  imports: [TypeOrmModule.forFeature([InvoiceStatus])],
  providers: [InvoiceStatusSeederService, InvoiceStatusService, InvoiceStatusResolver],
})

export class InvoiceStatusModule implements OnModuleInit {
  constructor(private readonly invoiceStatusSeederService: InvoiceStatusSeederService) {}

  async onModuleInit() {
    await this.invoiceStatusSeederService.seedInvoiceStatuses();
  }
}