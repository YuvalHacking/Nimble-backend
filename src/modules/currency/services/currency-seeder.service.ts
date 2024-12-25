import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Currency } from '@currencyEntity';
import { currencies } from '@common/constants';

/**
 * The CurrencySeederService is responsible for seeding currency data into the database. 
 * It checks if predefined currencies exist and adds them to the database if they do not.
 */
@Injectable()
export class CurrencySeederService {
  private readonly logger = new Logger(CurrencySeederService.name);

  constructor(
    @InjectRepository(Currency)
    private readonly currencyRepository: Repository<Currency>,
  ) {}

  /**
   * Populate the database with currencies if they do not already exist.
   * 
   * @returns {Promise<void>} - Resolves when seeding is complete.
   * @throws Will throw an error if there is an issue with the database operation.
   */
  async seedCurrencies(): Promise<void> {
    try {
      for (const currency of currencies) {
        const existingCurrency = await this.currencyRepository.findOne({ where: { name: currency } });
        if (!existingCurrency) {
          await this.currencyRepository.save({ name: currency });
        }
      }
      this.logger.log('Currencies seeded successfully');
    } catch (err) {
      this.logger.error('Error seeding currencies:', err);
      throw new Error('Error seeding currencies');
    }
  }
}
