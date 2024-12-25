import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CreateInvoiceDto } from "@modules/invoice/models/dtos/create-invoice.dto";
import { CreateSupplierDto } from "@modules/supplier/models/dtos/create-supplier.dto";
import { InvoiceRow } from "../types/input.interface";
import { Logger } from "@nestjs/common";

const logger = new Logger('Validation-Utils');

/**
 * Validates a given row against a specified DTO class.
 * 
 * @param {InvoiceRow} row - The row data to validate.
 * @param {CreateSupplierDto | CreateInvoiceDto} dto - The DTO class to validate against.
 * @returns {Promise<void>} - Resolves if validation passes, otherwise throws an error.
 * @throws Will throw an error if validation fails.
 */
export async function validateDto(
  row: InvoiceRow,
  dto: new () => CreateSupplierDto | CreateInvoiceDto
): Promise<void> {
  try {
    const plainValue = plainToInstance(dto, row);

    const errors = await validate(plainValue);

    if (errors.length > 0) {
      logger.error('Validation errors:', errors);
      throw new Error('Validation failed');
    }
  } catch (err) {
    logger.error('Error during validation:', err);
    throw err;
  }
}