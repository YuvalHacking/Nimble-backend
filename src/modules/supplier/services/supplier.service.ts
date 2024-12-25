import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { validateDto } from '@common/utils/validation.utils';
import { InvoiceRow } from '@common/types/input.interface';
import { CreateSupplierDto } from '../models/dtos/create-supplier.dto';
import { Supplier } from '@supplierEntity';

/**
 * SupplierService provides methods for managing supplier data,
 * including creation from CSV, deletion, and retrieval of suppliers.
 */
@Injectable()
export class SupplierService {
  private readonly logger = new Logger(SupplierService.name);

  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
  ) {}

  /**
   * Creates a supplier from a CSV row.
   * 
   * @param {InvoiceRow} row - The CSV row data.
   * @returns {Promise<Supplier>} - The created supplier.
   * @throws Will throw an error if there is an issue with validation or creation.
   */
  async createFromCsv(row: InvoiceRow): Promise<Supplier> {
    try {
      await validateDto(row, CreateSupplierDto);

      const supplier = new Supplier();
      supplier.internal_id = row.supplier_internal_id;
      supplier.external_id = row.supplier_external_id;
      supplier.company_name = row.supplier_company_name;
      supplier.address = row.supplier_address;
      supplier.city = row.supplier_city;
      supplier.country = row.supplier_country;
      supplier.contact_name = row.supplier_contact_name;
      supplier.phone = row.supplier_phone;
      supplier.email = row.supplier_email;
      supplier.bank_code = row.supplier_bank_code;
      supplier.bank_branch_code = row.supplier_bank_branch_code;
      supplier.bank_account_number = row.supplier_bank_account_number;
      supplier.status = row.supplier_status;
      supplier.stock_value = row.supplier_stock_value;
      supplier.withholding_tax = row.supplier_withholding_tax;

      await this.supplierRepository.save(supplier);
      this.logger.log(`Supplier with internal ID ${supplier.internal_id} created successfully`);
      return supplier;
    } catch (err) {
      this.logger.error('Error finding or creating supplier from CSV row:', err);
      throw new Error('Error finding or creating supplier from CSV row');
    }
  }

  /**
   * Deletes all suppliers from the database.
   * 
   * @returns {Promise<void>} - Resolves when all suppliers are deleted.
   * @throws Will throw an error if there is an issue with deleting the suppliers.
   */
  async deleteAll(): Promise<void> {
    try {
      await this.supplierRepository.delete({});
      this.logger.log('All suppliers deleted successfully');
    } catch (err) {
      this.logger.error('Error deleting all suppliers:', err);
      throw new Error('Error deleting all suppliers');
    }
  }

    /**
   * Finds all suppliers.
   * 
   * @returns {Promise<Supplier[]>} - The list of all suppliers.
   * @throws Will throw an error if there is an issue with the database operation.
   */
    async findAll(): Promise<Supplier[]> {
      try {
        const suppliers = await this.supplierRepository.find();
        this.logger.log('All suppliers retrieved successfully');
        return suppliers;
      } catch (err) {
        this.logger.error('Error retrieving all suppliers:', err);
        throw new Error('Error retrieving all suppliers');
      }
    }

      /**
   * Finds a supplier by ID.
   * 
   * @param {number} id - The ID of the supplier.
   * @returns {Promise<Supplier>} - The found supplier.
   * @throws Will throw an error if there is an issue with the database operation.
   */
  async findById(id: string): Promise<Supplier> {
    try {
      const supplier = await this.supplierRepository.findOne({ where: { internal_id: id } });
      if (!supplier) {
        throw new Error(`Supplier with ID ${id} not found`);
      }
      return supplier;
    } catch (err) {
      this.logger.error(`Error retrieving supplier with ID ${id}:`, err);
      throw new Error(`Error retrieving supplier with ID ${id}`);
    }
  }
}