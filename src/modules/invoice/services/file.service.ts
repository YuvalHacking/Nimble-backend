import { Injectable, Logger } from '@nestjs/common';
import {
  createReadStream,
  createWriteStream,
  existsSync,
  mkdirSync,
  unlinkSync,
} from 'fs';
import { join } from 'path';
import * as csvParser from 'csv-parser';
import { FileUpload } from 'graphql-upload';

import { InvoiceRow } from '@common/types/input.interface';
import { InvoiceService } from './invoice.service';
import { SupplierService } from '../../supplier/services/supplier.service';
import { Invoice } from '@invoiceEntity';
import { Supplier } from '@supplierEntity';

/**
 * FileService provides methods for handling and processing CSV files
 * related to invoice data, including reading, saving, and processing
 * invoices and supplier information from CSV files.
 */
@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);
  private readonly uploadsDir = join(__dirname, '..', '..', 'uploads');
  private supplierMap: Map<string, Supplier> = new Map(); 

  constructor(
    private readonly invoiceService: InvoiceService,
    private readonly supplierService: SupplierService,
  ) {}

  /**
   * Reads and processes a CSV file.
   *
   * @param {FileUpload} file - The CSV file to read.
   * @returns {Promise<boolean>} - Resolves to true if the file is processed successfully.
   * @throws {Error} - Throws an error if there is an issue with reading or processing the file.
   */
  async readCSVFile(file: FileUpload): Promise<boolean> {
    this.logger.log('Starting to read CSV file');

    try {
      const { createReadStream, filename } = file;
      const filePath = this.getFilePath(filename);

      this.ensureUploadsDirExists();

      await this.saveFile(createReadStream, filePath);

      const result = await this.processCSVFile(filePath);
      this.logger.log('Finished reading CSV file');

      return result;

    } catch (err) {
      this.logger.error('Error reading CSV file:', err);
      throw new Error('Error reading CSV file');
    }
  }

  private getFilePath(filename: string): string {
    return join(this.uploadsDir, filename);
  }

  private ensureUploadsDirExists(): void {
    if (!existsSync(this.uploadsDir)) {
      mkdirSync(this.uploadsDir);
    }
  }

  /**
   * Saves the file to the specified file path.
   *
   * @param {() => NodeJS.ReadableStream} createReadStream - The function to create a readable stream.
   * @param {string} filePath - The path to save the file.
   * @returns {Promise<void>} - Resolves when the file is saved successfully.
   * @throws {Error} - Throws an error if there is an issue with saving the file.
   */
  private saveFile(
    createReadStream: () => NodeJS.ReadableStream,
    filePath: string,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const stream = createReadStream();
      const writeStream = createWriteStream(filePath);
      stream.pipe(writeStream);

      writeStream.on('finish', resolve);
      writeStream.on('error', (err) => {
        this.logger.error('Error writing CSV file:', err);
        reject(new Error('Error writing CSV file'));
      });
    });
  }

  /**
   * Processes the CSV file at the specified file path.
   * Loops through the CSV file 
   *
   * @param {string} filePath - The path of the CSV file to process.
   * @returns {Promise<boolean>} - Resolves to true if the file is processed successfully.
   * @throws {Error} - Throws an error if there is an issue with processing the file.
   */
  private async processCSVFile(filePath: string): Promise<boolean> {
    const rows: InvoiceRow[] = [];
    const uniqueSuppliers = new Set<string>();
    const supplierRows: { [key: string]: InvoiceRow } = {};

    return new Promise<boolean>((resolve, reject) => {
      createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (row: InvoiceRow) => {
          rows.push(row);

          if (!uniqueSuppliers.has(row.supplier_internal_id)) {
            uniqueSuppliers.add(row.supplier_internal_id);
            supplierRows[row.supplier_internal_id] = row;
          }
        })
        .on('end', async () => {
          try {
            // Create unique suppliers first
            const supplierPromises = Array.from(uniqueSuppliers).map(async (supplierId) => {
              const supplier = await this.supplierService.createFromCsv(supplierRows[supplierId]);
              this.supplierMap.set(supplierId, supplier);
              return supplier;
            });
            await Promise.all(supplierPromises);
            

            // Process invoices after suppliers are ready
            const rowPromises = rows.map((row) =>
              this.processInvoice(row),
            );
            const invoices = await Promise.all(rowPromises);

            // Save invoices to the database
            await this.invoiceService.saveInvoices(invoices);

            unlinkSync(filePath);
            this.logger.log(
              'CSV file processed and invoices saved successfully',
            );
            resolve(true);
          } catch (err) {
            this.logger.error('Error saving invoices:', err);
            reject(new Error('Error saving invoices'));
          }
        })
        .on('error', (err) => {
          this.logger.error('Error reading CSV file:', err);
          reject(new Error('Error reading CSV file'));
        });
    });
  }

  /**
   * Processes a single invoice row.
   * Create a new invoice from the row data.
   *
   * @param {InvoiceRow} row - The invoice row to process.
   * @returns {Promise<Invoice>} - The processed invoice.
   * @throws {Error} - Throws an error if there is an issue with processing the invoice row.
   */
  private async processInvoice(row: InvoiceRow): Promise<Invoice> {
    try {
      let supplier = this.supplierMap.get(row.supplier_internal_id)

      // If supplier is not in the map of recently new suppliers - 
      // find the supplier in the database
      if (!supplier) {
        supplier = await this.supplierService.findById(row.supplier_internal_id);
        this.supplierMap.set(row.supplier_internal_id, supplier);
      }
      return this.invoiceService.createFromCsv(row, supplier);
    } catch (err) {
      this.logger.error('Error processing invoice row:', err);
      throw new Error('Error processing invoice row');
    }
  }

  /**
   * Validates if the file is a CSV file.
   *
   * @param {FileUpload} file - The file to validate.
   * @throws {Error} - Throws an error if the file is not a CSV file.
   */
  validateCSVFileType(file: FileUpload): void {
    if (!file.mimetype.startsWith('text/csv')) {
      const errorMessage = 'Invalid file type. Only CSV files are supported.';
      this.logger.error(errorMessage);
      throw new Error(errorMessage);
    }
  }
}
