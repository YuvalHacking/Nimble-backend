import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloDriverConfig } from '@nestjs/apollo';
import * as dotenv from 'dotenv';

import { databaseConfig } from '@config/database.config';
import { graphqlConfig } from '@config/graphql.config';
import { LoggingMiddleware } from '@common/middlewares/logging.middleware';
import { InvoiceStatusModule } from '@modules/invoice-status/invoice-status.module';
import { InvoicesModule } from '@modules/invoice/invoice.module';
import { SupplierModule } from '@modules/supplier/supplier.module';
import { CurrencyModule } from '@modules/currency/currency.module';

dotenv.config();

@Module({
  imports: [
    InvoicesModule,
    SupplierModule,
    CurrencyModule, 
    InvoiceStatusModule,
   GraphQLModule.forRoot<ApolloDriverConfig>(graphqlConfig),
   TypeOrmModule.forRoot(databaseConfig),
  ],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}