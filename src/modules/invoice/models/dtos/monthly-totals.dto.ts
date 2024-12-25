import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsArray, IsInt, IsString } from 'class-validator';

@ArgsType()
export class MonthlyTotalsDto {
  @IsArray()
  @Field(() => [String], { nullable: true })
  supplierIds?: string[];

  @IsString()
  @Field(() => String, { nullable: true })
  startDate?: string;

  @IsString()
  @Field(() => String, { nullable: true })
  endDate?: string;

  @IsInt()
  @Field(() => Int, { nullable: true })
  statusId?: number;
}