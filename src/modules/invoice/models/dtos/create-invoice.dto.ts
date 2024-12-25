import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsIn, IsNumber, IsPositive } from 'class-validator';
import { currencies, invoiceStatuses } from '@common/constants';
import { Currency, InvoiceStatus } from '@common/types/input.interface';
import { createDateFromString } from '@common/utils/date.utils';

export class CreateInvoiceDto {
  @IsString()
  @IsNotEmpty()
  invoice_id: string;

  @IsNotEmpty()
  @Transform(({ value }) => createDateFromString(value))
  invoice_date: Date;

  @IsNotEmpty()
  @Transform(({ value }) => createDateFromString(value))
  invoice_due_date: Date;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @Transform(({ value }) => parseFloat(value))
  invoice_cost: number;

  @IsIn(currencies, {
    message: `invoice_currency must be one of the following: ${currencies.join(', ')}`,
  })
  @IsNotEmpty()
  invoice_currency: Currency;

  @IsIn(invoiceStatuses, {
    message: `invoice_status must be one of the following: ${invoiceStatuses.join(', ')}`,
  })
  @IsNotEmpty()
  invoice_status: InvoiceStatus;

  @IsString()
  @IsNotEmpty()
  supplier_internal_id: string;
}
