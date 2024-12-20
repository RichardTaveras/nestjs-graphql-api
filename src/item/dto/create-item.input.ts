import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateItemInput {
  @Field()
  nombre: string;

  @Field()
  descripcion: string;
}
