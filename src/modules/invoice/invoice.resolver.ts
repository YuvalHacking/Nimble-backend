import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { Injectable } from '@nestjs/common';
import { InvoiceService } from './services/invoice.service';
import { FileService } from './services/file.service';
import { AnalyticsService } from './services/analytics.service';
import { SupplierService } from '../supplier/services/supplier.service';
import {AmountsByStatusDto } from './models/dtos/amounts-by-status.dto'
import { OverdueTrendDto } from './models/dtos/overdue-trend.dto';
import { MonthlyTotalsDto } from './models/dtos/monthly-totals.dto';
import { WeeklyMetricsDto } from './models/dtos/weekly-metrics.dto';
import { ChartData } from '@common/dtos/chart.dto';

/**
 * The InvoiceResolver handles operations related to invoice data. 
 * It provides functionality for querying and mutating invoice-related information.
 */
@Resolver()
@Injectable()
export class InvoiceResolver {

  constructor(
    private readonly invoiceService: InvoiceService,
    private readonly supplierService: SupplierService,
    private readonly analyticsService: AnalyticsService,
    private readonly fileService: FileService
  ) {}

  /**
   * Uploads a CSV file and load its content to the database.
   * 
   * @param {FileUpload} file - The CSV file to upload.
   * @returns {Promise<boolean>} - Resolves to true if the upload and processing are successful.
   * @throws Will throw an error if there is an issue with the file upload or processing.
   */
  @Mutation(() => Boolean)
  async uploadCSV(
    @Args({ name: 'file', type: () => GraphQLUpload }) file: FileUpload,
  ): Promise<boolean> {

    this.fileService.validateCSVFileType(file);

    // Deletes all previous data - for testing purposes
    await this.invoiceService.deleteAll();
    await this.supplierService.deleteAll();

    return await this.fileService.readCSVFile(file);
  }

   /**
   * Retrieves the amounts grouped by invoice status.
   * 
   * @param {AmountsByStatusDto} filters - Filters to apply when retrieving the data.
   * @returns {Promise<ChartData[]>} - A promise that resolves to a list of chart data representing the amounts by status.
   */
   @Query(() => [ChartData])
   async getAmountsByStatus(@Args() filters: AmountsByStatusDto): Promise<ChartData[]> {
     return this.analyticsService.getAmountsByStatus(filters);
   }
 
   /**
    * Retrieves the trend of overdue invoices.
    * 
    * @param {OverdueTrendDto} filters - Filters to apply when retrieving overdue invoice trends.
    * @returns {Promise<ChartData[]>} - A promise that resolves to a list of chart data representing the overdue trend.
    */
   @Query(() => [ChartData])
   async getOverdueTrend(@Args() filters: OverdueTrendDto): Promise<ChartData[]> {
     return this.analyticsService.getOverdueInvoicesTrend(filters);
   }
 
   /**
    * Retrieves the monthly totals based on the provided filters.
    * 
    * @param {MonthlyTotalsDto} filters - Filters to apply when retrieving monthly totals.
    * @returns {Promise<ChartData[]>} - A promise that resolves to a list of chart data representing the monthly totals.
    */
   @Query(() => [ChartData])
   async getMonthlyTotals(@Args() filters: MonthlyTotalsDto): Promise<ChartData[]> {
     return this.analyticsService.getMonthlyTotals(filters);
   }
 
   /**
    * Retrieves the weekly metrics for invoice-related analytics.
    * 
    * @returns {Promise<WeeklyMetricsDto>} - A promise that resolves to a DTO containing weekly invoice metrics.
    */
   @Query(() => WeeklyMetricsDto)
   async getWeeklyMetrics(): Promise<WeeklyMetricsDto> {
     return this.analyticsService.getWeeklyMetrics();
   }
 }