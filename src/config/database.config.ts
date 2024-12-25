import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from './constants';
import { Invoice } from '@invoiceEntity';
import { InvoiceStatus } from '@invoiceStatusEntity';
import { Supplier } from '@supplierEntity';
import { Currency } from '@currencyEntity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: config.DB_HOST,
  port: config.DB_PORT,
  username: config.DB_USER,
  password: config.DB_PASSWORD,
  database: config.DB_NAME,
  entities: [
    Invoice,
    InvoiceStatus,
    Supplier,
    Currency, 
  ],
  synchronize: true,
};
