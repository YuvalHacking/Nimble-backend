import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn, OneToMany, Index } from 'typeorm';
import { supplierStatuses } from '@common/constants';
import { SupplierStatus } from '@common/types/input.interface';
import { Invoice } from '@invoiceEntity';

@ObjectType()
@Entity('suppliers')
@Index('idx_internal_id', ['internal_id'])
@Index('idx_external_id', ['external_id'])
export class Supplier {
  @Field()
  @PrimaryColumn({ length: 50 })
  internal_id: string;

  @Field({ nullable: true })
  @Column({ length: 50, nullable: true })
  external_id: string;

  @Field()
  @Column({ length: 100 })
  company_name: string;

  @Field()
  @Column({ length: 255 })
  address: string;

  @Field()
  @Column({ length: 100 })
  city: string;

  @Field()
  @Column({ length: 50 })
  country: string;

  @Field()
  @Column({ length: 100 })
  contact_name: string;

  @Field()
  @Column({ length: 20 })
  phone: string;

  @Field()
  @Column({ length: 100 })
  email: string;

  @Field()
  @Column({ length: 50 })
  bank_code: string;

  @Field()
  @Column({ length: 50 })
  bank_branch_code: string;

  @Field()
  @Column({ type: 'bigint'})
  bank_account_number: number;

  @Field()
  @Column({
    type: 'enum',
    enum: supplierStatuses,
    default: supplierStatuses[0],
  })
  status: SupplierStatus;

  @Field()
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  stock_value: number;

  @Field()
  @Column({ type: 'decimal', precision: 5, scale: 2 })
  withholding_tax: number;

  @OneToMany(() => Invoice, (invoice) => invoice.supplier)
  invoices: Invoice[];
}
