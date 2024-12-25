import { ArgsType, Field } from '@nestjs/graphql';
import { IsArray, IsString } from 'class-validator';

@ArgsType()
export class AmountsByStatusDto {
  @IsArray()
  @Field(() => [String], { nullable: true })
  supplierIds?: string[];

  @IsString()
  @Field(() => String, { nullable: true })
  startDate?: string;

  @IsString()
  @Field(() => String, { nullable: true })
  endDate?: string;
}