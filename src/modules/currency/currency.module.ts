import { Module, OnModuleInit } from '@nestjs/common';
import { CurrencyService } from './services/currency.service';
import { CurrencySeederService} from './services/currency-seeder.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Currency } from '@currencyEntity';

/**
 * The CurrencyModule is responsible for managing currency-related operations.
 * It provides the CurrencyService for handling business logic related to currencies
 * and the populating the database with initial currency data.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Currency])],
  providers: [CurrencySeederService, CurrencyService],
})

export class CurrencyModule implements OnModuleInit {
  constructor(private readonly currencySeederService: CurrencySeederService) {}
  
  async onModuleInit() {
    await this.currencySeederService.seedCurrencies();
  }
}