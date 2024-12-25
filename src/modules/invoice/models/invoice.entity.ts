import { ObjectType, Field, Float } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { InvoiceStatus } from '@invoiceStatusEntity';
import { Currency } from '@currencyEntity';
import { Supplier } from '@supplierEntity';

@ObjectType()
@Entity('invoices')
@Index('idx_status', ['status'])
@Index('idx_currency', ['currency'])
@Index('idx_supplier', ['supplier'])
@Index('idx_dates', ['date', 'due_date'])
@Index('idx_status_supplier', ['status', 'due_date', 'supplier'])
export class Invoice {
  @Field()
  @PrimaryColumn()
  id: string;

  @Field()
  @Column({ type: 'date' })
  date: Date;

  @Field()
  @Column({ type: 'date' })
  due_date: Date;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  cost: number;

  @Field(() => Currency)
  @ManyToOne(() => Currency, (currency) => currency.invoices)
  @JoinColumn({ name: 'currency_id' })
  currency: Currency;

  @Field(() => InvoiceStatus)
  @ManyToOne(() => InvoiceStatus, (status) => status.invoices)
  @JoinColumn({ name: 'status_id' })
  status: InvoiceStatus;

  @Field(() => Supplier)
  @ManyToOne(() => Supplier, (supplier) => supplier.invoices)
  @JoinColumn({ name: 'supplier_internal_id' })
  supplier: Supplier;
}