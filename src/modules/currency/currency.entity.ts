import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, Index } from 'typeorm';
import { Invoice } from '@invoiceEntity';

@ObjectType()
@Entity('currency')
@Index('idx_currency_id', ['id'])
export class Currency {

@Field(() => Int)
@PrimaryGeneratedColumn()
id: number;

@Field()
@Column({ length: 10 })
name: string;

@OneToMany(() => Invoice, (invoice) => invoice.currency)
invoices: Invoice[];
}
