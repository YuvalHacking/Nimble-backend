import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {SupplierResolver} from './supplier.resolver';
import { SupplierService } from './services/supplier.service';
import { AnalyticsService } from './services/analytics.service';
import { Supplier } from '@supplierEntity';

/**
 * The SupplierModule is responsible for managing supplier-related services and resolvers in the application.
 * It integrates services related to suppliers and analytics.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Supplier])],
  providers: [SupplierService, AnalyticsService, SupplierResolver],
})
export class SupplierModule {}
