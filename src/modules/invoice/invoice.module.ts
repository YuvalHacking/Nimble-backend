import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceResolver } from './invoice.resolver';
import { InvoiceService } from './services/invoice.service';
import { CurrencyService } from '../currency/services/currency.service';
import { SupplierService } from '../supplier/services/supplier.service';
import { InvoiceStatusService } from '../invoice-status/services/invoice-status.service';
import { FileService } from './services/file.service';
import { AnalyticsService } from './services/analytics.service';
import { Invoice } from '@invoiceEntity';
import { InvoiceStatus } from '@invoiceStatusEntity';
import { Currency } from '@currencyEntity';
import { Supplier } from '@supplierEntity';

/**
 * The InvoicesModule is responsible for managing the invoice-related services and resolvers in the application. 
 * It integrates various services related to invoices, currency, suppliers, invoice statuses, and analytics.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Invoice, InvoiceStatus, Currency, Supplier]),
  ],
  providers: [
    InvoiceService,
    InvoiceResolver,
    SupplierService,
    CurrencyService,
    InvoiceStatusService,
    AnalyticsService,
    FileService,
  ],
})

export class InvoicesModule implements OnModuleInit {
  constructor(private readonly invoiceService: InvoiceService) {}

  async onModuleInit() {
    await this.invoiceService.initializeMaps();
  }
}