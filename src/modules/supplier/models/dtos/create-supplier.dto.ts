import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsEmail, IsIn, IsPositive, IsNumber } from 'class-validator';
import { supplierStatuses } from '@common/constants';
import { SupplierStatus } from '@common/types/input.interface';

export class CreateSupplierDto {
  @IsString()
  @IsNotEmpty()
  supplier_internal_id: string;

  @IsString()
  @IsNotEmpty()
  supplier_external_id: string;

  @IsString()
  @IsNotEmpty()
  supplier_company_name: string;

  @IsString()
  @IsNotEmpty()
  supplier_address: string;

  @IsString()
  @IsNotEmpty()
  supplier_city: string;

  @IsString()
  @IsNotEmpty()
  supplier_country: string;

  @IsString()
  @IsNotEmpty()
  supplier_contact_name: string;

  @IsString()
  @IsNotEmpty()
  supplier_phone: string;

  @IsEmail()
  @IsNotEmpty()
  supplier_email: string;

  @IsString()
  supplier_bank_code: string;

  @IsString()
  supplier_bank_branch_code: string;

  @IsString()
  supplier_bank_account_number: string;

  @IsIn(supplierStatuses)
  @IsNotEmpty()
  supplier_status: SupplierStatus;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @Transform(({ value }) => parseFloat(value))
  supplier_stock_value: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @Transform(({ value }) => parseFloat(value))
  supplier_withholding_tax: number;
}
