import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Currency } from '@currencyEntity';

/**
 * The CurrencyService handles the business logic related to currencies.
 * It provides methods to interact with the currency data in the database, 
 */
@Injectable()
export class CurrencyService {
  private readonly logger = new Logger(CurrencyService.name);

  constructor(
    @InjectRepository(Currency)
    private readonly currencyRepository: Repository<Currency>,
  ) {}

  /**
   * Retrieve all currencies from the database.
   * 
   * @returns {Promise<Currency[]>} - A promise that resolves to an array of Currency entities.
   * @throws Will throw an error if there is an issue with the database operation.
   */
  async findAll(): Promise<Currency[]> {
    try {
      const currencies = await this.currencyRepository.find();
      this.logger.log('All currencies retrieved successfully');
      return currencies;
    } catch (err) {
      this.logger.error('Error retrieving all currencies:', err);
      throw new Error('Error retrieving all currencies');
    }
  }
}
