import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { subWeeks } from 'date-fns';

import { applyInvoiceFilters } from '@common/utils/queryFilters.utils';
import { ChartData } from '@common/dtos/chart.dto';
import { AmountsByStatusDto } from '../models/dtos/amounts-by-status.dto';
import { OverdueTrendDto } from '../models/dtos/overdue-trend.dto';
import { MonthlyTotalsDto } from '../models/dtos/monthly-totals.dto';
import { WeeklyMetricsDto } from '../models/dtos/weekly-metrics.dto';
import { Invoice } from '@invoiceEntity';
import { InvoiceStatus } from '@invoiceStatusEntity';
import { InvoiceStatusEnum } from '@common/constants';

/**
 * AnalyticsService provides methods for analyzing invoice data
 * and generating insights for the application.
 */
@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
  ) {}

  /**
   * Retrieves the total invoice amounts categorized by status.
   * 
   * @param {AmountsByStatusDto} filters - Filters for supplier IDs and date range.
   * @returns {Promise<ChartData[]>} - Chart data representing amounts by status.
   * @throws {Error} If there is an issue during the database query.
   */
  async getAmountsByStatus(filters: AmountsByStatusDto): Promise<ChartData[]> {
    const { supplierIds, startDate: start, endDate: end } = filters;
    const startDate = start ? new Date(start) : undefined;
    const endDate = end ? new Date(end) : undefined;

    this.logger.log(`Fetching amounts by status for suppliers: ${supplierIds},
                     between ${startDate} and ${endDate}`);

    try {
      let query = this.invoiceRepository
        .createQueryBuilder('invoice')
        .select('status.name', 'status')
        .addSelect('SUM(invoice.cost)', 'totalAmount')
        .innerJoin(InvoiceStatus, 'status', 'invoice.status_id = status.id');

      // Applies filters to the invoice query based on the provided parameters.
      query = applyInvoiceFilters(query, startDate, endDate, supplierIds);

      query.groupBy('status.name');

      const result = await query.getRawMany();
      this.logger.log('Amounts by status fetched successfully');

      return result.map((row) => ({
        name: row.status,
        value: row.totalAmount,
      }));
    } catch (err) {
      this.logger.error('Error fetching amounts by status:', err);
      throw new Error('Error fetching amounts by status');
    }
  }

  /**
   * Retrieves a trend of overdue invoices over time.
   * 
   * @param {OverdueTrendDto} filters - Filters for supplier IDs and date range.
   * @returns {Promise<ChartData[]>} - Chart data representing overdue trends.
   * @throws {Error} If there is an issue during the database query.
   */
  async getOverdueInvoicesTrend(filters: OverdueTrendDto): Promise<ChartData[]> {
    const { supplierIds, startDate: start, endDate: end } = filters;
    const startDate = start ? new Date(start) : undefined;
    const endDate = end ? new Date(end) : undefined;

    this.logger.log(`Fetching overdue invoices for suppliers: ${supplierIds},
                     between ${startDate} and ${endDate}`);

    try {
      let query = this.invoiceRepository
        .createQueryBuilder('invoice')
        .select("invoice.due_date")
        .addSelect('COUNT(invoice.id)', 'value')
        .innerJoin(InvoiceStatus, 'status', 'invoice.status_id = status.id')
        .where('status.name = :status', { status: InvoiceStatusEnum.OVERDUE });

      query = applyInvoiceFilters(query, startDate, endDate, supplierIds);

      query
        .groupBy("invoice.due_date")
        .orderBy("invoice.due_date");

      const result = await query.getRawMany();
      this.logger.log('Overdue invoices trend fetched successfully');

      return result.map((row) => ({
        name: row.invoice_due_date.toLocaleDateString('en-GB'),
        value: row.value,
      }));
    } catch (err) {
      this.logger.error('Error fetching overdue invoices trend:', err);
      throw new Error('Error fetching overdue invoices trend');
    }
  }

  /**
   * Retrieves the total invoice amounts by month.
   * 
   * @param {MonthlyTotalsDto} filters - Filters for supplier IDs, date range, and status ID.
   * @returns {Promise<ChartData[]>} - Chart data representing monthly totals.
   * @throws {Error} If there is an issue during the database query.
   */
  async getMonthlyTotals(filters: MonthlyTotalsDto): Promise<ChartData[]> {
    const { supplierIds, startDate: start, endDate: end, statusId } = filters;
    const startDate = start ? new Date(start) : undefined;
    const endDate = end ? new Date(end) : undefined;

    this.logger.log(`Fetching monthly totals for suppliers: ${supplierIds},
      between ${startDate} and ${endDate}, with statusId: ${statusId}`);

    try {
      let query = this.invoiceRepository
        .createQueryBuilder('invoice')
        .select("TO_CHAR(invoice.date, 'Month YYYY')", 'name')
        .addSelect('SUM(invoice.cost)', 'value')
        .innerJoin('invoice.status', 'status');

      query = applyInvoiceFilters(
        query,
        startDate,
        endDate,
        supplierIds,
        statusId,
      );

      query.groupBy("TO_CHAR(invoice.date, 'Month YYYY')")
      
      const result = await query.getRawMany();
      this.logger.log('Monthly totals fetched successfully');

      return result.map((row) => ({
        name: row.name.trim(),
        value: parseFloat(row.value),
      }));
    } catch (err) {
      this.logger.error('Error fetching monthly totals:', err);
      throw new Error('Error fetching monthly totals');
    }
  }

  /**
   * Fetches metrics for invoices, including total amounts, counts, and overdue counts,
   * for a specified date range.
   * 
   * @param {Date} startDate - The start date for the range.
   * @param {Date} endDate - The end date for the range.
   * @returns {Promise<any>} - Metrics data including total amount, count, and overdue count.
   * @private
   */
  private async getInvoiceMetrics(startDate: Date, endDate: Date): Promise<any> {
    const data = await this.invoiceRepository
      .createQueryBuilder('invoice')
      .select('COALESCE(SUM(invoice.cost), 0)', 'totalAmount')
      .addSelect('COALESCE(COUNT(invoice.id), 0)', 'invoiceCount')
      .where('invoice.date BETWEEN :startDate AND :endDate', { startDate, endDate })
      .getRawOne();

    const overdueCount = await this.invoiceRepository
      .createQueryBuilder('invoice')
      .select('COALESCE(COUNT(invoice.id), 0)', 'overdueCount')
      .innerJoin(InvoiceStatus, 'status', 'invoice.status_id = status.id')
      .where('status.name = :status', { status: InvoiceStatusEnum.OVERDUE })
      .andWhere('invoice.date BETWEEN :startDate AND :endDate', { startDate, endDate })
      .getRawOne();

    return {
      totalAmount: parseFloat(data.totalAmount),
      invoiceCount: parseInt(data.invoiceCount, 10),
      overdueCount: parseInt(overdueCount.overdueCount, 10),
    };
  }

  /**
   * Computes and retrieves metrics for the current and previous weeks,
   * including earnings, invoice counts, and overdue invoice counts, along with percentage changes.
   * 
   * @returns {Promise<WeeklyMetricsDto>} - Weekly metrics data with percentage differences.
   * @throws {Error} If there is an issue during the data processing.
   */
  async getWeeklyMetrics(): Promise<WeeklyMetricsDto> {
    const today = new Date();
    const startOfThisWeek = subWeeks(today, 1);
    const endOfThisWeek = today;
    const startOfLastWeek = subWeeks(today, 2);
    const endOfLastWeek = subWeeks(today, 1);

    this.logger.log(`Fetching weekly metrics from ${startOfThisWeek} to ${endOfThisWeek}`);

    try {

      const thisWeekData = await this.getInvoiceMetrics(startOfThisWeek, endOfThisWeek);
      const lastWeekData = await this.getInvoiceMetrics(startOfLastWeek, endOfLastWeek);

      const calculatePercentageChange = (current, previous) => {
        if (previous === 0) return current === 0 ? 0 : 100;
        return Math.round(((current - previous) / previous) * 100);
      };

      const totalAmountChange = calculatePercentageChange(
        thisWeekData.totalAmount,
        lastWeekData.totalAmount,
      );
      const invoiceCountChange = calculatePercentageChange(
        thisWeekData.invoiceCount,
        lastWeekData.invoiceCount,
      );
      const overdueCountChange = calculatePercentageChange(
        thisWeekData.overdueCount,
        lastWeekData.overdueCount,
      );

      return {
        earnings: {
          difference: totalAmountChange,
          amount: Math.round(thisWeekData.totalAmount),
        },
        invoices: {
          difference: invoiceCountChange,
          amount: thisWeekData.invoiceCount,
        },
        overdue: {
          difference: overdueCountChange,
          amount: thisWeekData.overdueCount,
        },
      };
    } catch (error) {
      this.logger.error('Error fetching weekly metrics', error);
      throw new Error('Error fetching weekly metrics');
    }
  }
}
