import { Field, ObjectType } from '@nestjs/graphql';
import { UUID } from 'crypto';

@ObjectType()
export class User {
  @Field()
  id: UUID;

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

  @Field({ nullable: true })
  photoUrl?: string;

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updatedAt?: Date;
}
