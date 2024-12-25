import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupplierAnalysisDto } from '../models/dtos/supplier-analysis.dto';
import { ChartData } from '@common/dtos/chart.dto';
import { Supplier } from '@supplierEntity';

/**
 * AnalyticsService provides methods for analyzing supplier data
 * and generating insights for the application.
 */
@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
  ) {}

  /**
   * Retrieves a supplier analysis based on the provided filters.
   * 
   * @param {SupplierAnalysisDto} filters - Filters for supplier IDs, date range, and status ID.
   * @returns {Promise<ChartData[]>} - Chart data representing supplier analysis.
   * @throws {Error} If there is an issue during the database query.
   */
  async getSupplierAnalysis(
    filters: SupplierAnalysisDto,
  ): Promise<ChartData[]> {
    const { supplierIds, startDate: start, endDate: end, statusId } = filters;
    const startDate = start ? new Date(start) : undefined;
    const endDate = end ? new Date(end) : undefined;

    this.logger.log(`Fetching supplier analysis for suppliers: ${supplierIds},
                     between ${startDate} and ${endDate}`);

    try {
      let query = this.supplierRepository
        .createQueryBuilder('supplier')
        .select('supplier.company_name', 'name')
        .addSelect('SUM(invoice.cost)', 'value')
        .innerJoin('supplier.invoices', 'invoice');

      if (supplierIds && supplierIds.length > 0) {
        query = query.andWhere('supplier.internal_id IN (:...supplierIds)', {
          supplierIds,
        });
      }

      if (startDate && endDate) {
        query.andWhere('invoice.date BETWEEN :startDate AND :endDate', {
          startDate,
          endDate,
        });
      }

      if (statusId) {
        query = query.andWhere('invoice.status_id = :statusId', { statusId });
      }

      query.groupBy('supplier.company_name');

      const result = await query.getRawMany();
      this.logger.log('Supplier analysis fetched successfully');

      return result.map((row) => ({
        name: row.name,
        value: parseFloat(row.value),
      }));
    } catch (err) {
      this.logger.error('Error fetching supplier analysis:', err);
      throw new Error('Error fetching supplier analysis');
    }
  }
}
