import { Resolver, Query, Args } from '@nestjs/graphql';
import { SupplierService } from './services/supplier.service';
import { AnalyticsService } from './services/analytics.service';
import { SupplierAnalysisDto } from './models/dtos/supplier-analysis.dto';
import { ChartData } from '@common/dtos/chart.dto';
import { Supplier } from '@supplierEntity';

/**
 * The SupplierResolver manages queries related to suppliers and their analytics.
 * It provides functionality for fetching supplier data and performing supplier-related analysis.
 */
@Resolver(() => Supplier)
export class SupplierResolver {
  constructor(private readonly supplierService: SupplierService,
              private readonly analyticsService: AnalyticsService) {}

  /**
   * Query to get all suppliers.
   * 
   * @returns {Promise<Supplier[]>} - The list of all suppliers.
   */
  @Query(() => [Supplier], { name: 'suppliers' })
  async getSuppliersOptions(): Promise<Supplier[]> {
    return this.supplierService.findAll();
  }

  /**
   * Query to perform customer analysis based on provided filters.
   * 
   * @param {SupplierAnalysisDto} filters - The filter criteria for the supplier analysis.
   * @returns {Promise<ChartData[]>} - A list of analysis data based on the filters.
   */
  @Query(() => [ChartData])
  async getCustomerAnalysis(@Args() filters: SupplierAnalysisDto): Promise<ChartData[]> {
    return this.analyticsService.getSupplierAnalysis(filters);
  }
}