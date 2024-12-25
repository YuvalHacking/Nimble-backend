import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
class MetricDto {
  @Field(() => Int)
  difference: number;

  @Field(() => Int)
  amount: number;
}

@ObjectType()
export class WeeklyMetricsDto {
  @Field(() => MetricDto)
  earnings: MetricDto;

  @Field(() => MetricDto)
  invoices: MetricDto;

  @Field(() => MetricDto)
  overdue: MetricDto;
}