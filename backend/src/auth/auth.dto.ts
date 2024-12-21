import { InputType, Field, ObjectType } from '@nestjs/graphql';

@InputType()
export class AuthenticateInput {
  @Field(() => String)
  initDataRaw: string;
}

@ObjectType()
export class UserResponse {
  @Field()
  id: string;

  @Field()
  tgId: number;

  @Field()
  firstName: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  username?: string;

  @Field({ nullable: true })
  isPremium?: boolean;

  @Field({ nullable: true })
  languageCode?: string;

  @Field()
  allowsWriteToPm: boolean;
}
