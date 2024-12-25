import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany, Index } from 'typeorm';
import { Invoice } from '@invoiceEntity';

@ObjectType()
@Entity('invoice_status')
@Index('idx_invoice_status_id', ['id']) 
export class InvoiceStatus {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;  

  @Field()
  @Column({ length: 20 })
  name: string;

  @OneToMany(() => Invoice, (invoice) => invoice.status)
  invoices: Invoice[];
}
