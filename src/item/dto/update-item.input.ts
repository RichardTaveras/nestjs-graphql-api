import { InputType, Field, PartialType, Int } from '@nestjs/graphql';
import { CreateItemInput } from './create-item.input';

@InputType()
export class UpdateItemInput extends PartialType(CreateItemInput) {
  @Field(() => Int)
  id: number;
}
