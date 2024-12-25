import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateInvoiceDto } from '../models/dtos/create-invoice.dto';
import { CurrencyService } from '../../currency/services/currency.service';
import { InvoiceStatusService } from '../../invoice-status/services/invoice-status.service';
import { createDateFromString } from '@common/utils/date.utils';
import { validateDto } from '@common/utils/validation.utils';
import { InvoiceRow } from '@common/types/input.interface';
import { InvoiceStatusEnum } from '@common/constants';
import { Invoice } from '@invoiceEntity';
import { Supplier } from '@supplierEntity';
import { Currency } from '@currencyEntity';
import { InvoiceStatus } from '@invoiceStatusEntity';

/**
 * InvoiceService provides methods for managing invoices, 
 * including creation, retrieval, deletion, and handling related data.
 */
@Injectable()
export class InvoiceService {
  private readonly logger = new Logger(InvoiceService.name);
  private currencyMap: Map<string, Currency> = new Map();
  private invoiceStatusMap: Map<string, InvoiceStatus> = new Map(); 

  constructor(
    @InjectRepository(Invoice) 
    private readonly invoiceRepository: Repository<Invoice>,
    private readonly currencyService: CurrencyService,
    private readonly invoiceStatusService: InvoiceStatusService,
  ) {}

  /**
   * Initializes the currency and invoice status maps
   * This is called to set up the service before processing invoices.
   * 
   * @returns {Promise<void>} - Resolves when the maps are initialized.
   */
  async initializeMaps(): Promise<void> {
    try {
      const currencies = await this.currencyService.findAll();
      const invoiceStatuses = await this.invoiceStatusService.findAll();

      currencies.forEach(currency => {
        this.currencyMap.set(currency.name, currency);
      });

      invoiceStatuses.forEach(status => {
        this.invoiceStatusMap.set(status.name, status);
      });

      this.logger.log('Currency and invoice status maps initialized successfully');
    } catch (err) {
      this.logger.error('Error initializing maps:', err);
      throw new Error('Error initializing maps');
    }
  }

  /**
   * Creates an invoice from a CSV row.
   * 
   * @param {InvoiceRow} row - The CSV row data.
   * @param {Supplier} supplier - The supplier associated with the invoice.
   * @returns {Promise<Invoice>} - The created invoice.
   * @throws Will throw an error if the invoice already exists or if there is an issue with validation or creation.
   */
  async createFromCsv(row: InvoiceRow, supplier: Supplier): Promise<Invoice> {
    try {
      const existingInvoice = await this.invoiceRepository.findOne({
        where: { id: row.invoice_id },
      });

      if (existingInvoice) {
        const errorMessage = `Invoice with ID ${row.invoice_id} already exists.`;
        this.logger.error(errorMessage);
        throw new BadRequestException(errorMessage);
      }

      await validateDto(row, CreateInvoiceDto);

      const { invoice_id, invoice_date, invoice_due_date, invoice_cost, invoice_currency } = row;

      const invoice = new Invoice();
      invoice.id = invoice_id;
      invoice.date = createDateFromString(invoice_date);
      invoice.due_date = createDateFromString(invoice_due_date);
      invoice.cost = invoice_cost;
      invoice.supplier = supplier;

      //Handle the invoice currency
      const currency = this.currencyMap.get(invoice_currency);
      if (!currency) {
        const errorMessage = `Currency ${invoice_currency} not found.`;
        this.logger.error(errorMessage);
        throw new BadRequestException(errorMessage);
      }
      invoice.currency = currency;

      //Handle the invoice status

      //If the invoice is overdue, set the status to PAID
      let invoiceStatus: string;
      if (new Date(invoice.due_date).getTime() < Date.now()) {
        invoiceStatus = InvoiceStatusEnum.OVERDUE;
      } else {
        invoiceStatus = row.invoice_status;
      }

      const status = this.invoiceStatusMap.get(invoiceStatus);
      if (!status) {
        const errorMessage = `Invoice status ${invoiceStatus} not found.`;
        this.logger.error(errorMessage);
        throw new BadRequestException(errorMessage);
      }

      invoice.status = status;

      await this.invoiceRepository.save(invoice);

      this.logger.log(`Invoice with ID ${invoice.id} created successfully`);

      return invoice;

    } catch (err) {
      this.logger.error('Error creating invoice from CSV row:', err);
      throw new Error('Error creating invoice from CSV row');
    }
  }

  /**
   * Saves an array of invoices to the database.
   * 
   * @param {Invoice[]} invoices - The invoices to save.
   * @returns {Promise<void>} - Resolves when the invoices are saved.
   * @throws Will throw an error if there is an issue with saving the invoices.
   */
  async saveInvoices(invoices: Invoice[]): Promise<void> {
    try {
      if (invoices.length === 0) {
        this.logger.warn('No invoices to save.');
        return;
      }

      this.logger.log(`Saving ${invoices.length} invoices...`);
      await this.invoiceRepository.save(invoices, { chunk: 100 });
      this.logger.log('Invoices saved successfully');
    } catch (err) {
      this.logger.error('Error saving invoices:', err);
      throw new Error('Error saving invoices');
    }
  }

  /**
   * Finds an invoice by its ID.
   * 
   * @param {string} id - The ID of the invoice to find.
   * @returns {Promise<Invoice | undefined>} - The found invoice or undefined if not found.
   * @throws Will throw an error if there is an issue with finding the invoice.
   */
  async findById(id: string): Promise<Invoice | undefined> {
    try {
      this.logger.log(`Finding invoice with ID: ${id}`);
      const invoice = await this.invoiceRepository.findOne({ where: { id } });
      if (!invoice) {
        const errorMessage = `Invoice with ID ${id} not found.`;
        this.logger.error(errorMessage);
        throw new Error(errorMessage);
      }
      this.logger.log(`Invoice with ID ${id} found successfully`);
      return invoice;
    } catch (err) {
      this.logger.error('Error finding invoice by ID:', err);
      throw new Error('Error finding invoice by ID');
    }
  }

  /**
   * Deletes all invoices from the database.
   * 
   * @returns {Promise<void>} - Resolves when all invoices are deleted.
   * @throws Will throw an error if there is an issue with deleting the invoices.
   */
  async deleteAll(): Promise<void> {
    try {
      this.logger.log('Deleting all invoices...');
      await this.invoiceRepository.delete({});
      this.logger.log('All invoices deleted successfully');
    } catch (err) {
      this.logger.error('Error deleting all invoices:', err);
      throw new Error('Error deleting all invoices');
    }
  }
}
