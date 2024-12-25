import { ObjectType, Field, Float } from '@nestjs/graphql';

@ObjectType()
export class ChartData {
  @Field()
  name: string;

  @Field(() => Float)
  value: number;
}