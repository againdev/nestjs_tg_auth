import { Field, ObjectType } from '@nestjs/graphql';
import { UserResponse } from './auth.dto';

@ObjectType()
export class AuntificateResponse {
  @Field(() => UserResponse, { nullable: true })
  user?: UserResponse;
}

export interface JwtSubject {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  is_premium?: boolean;
  start_param?: string;
  language_code: string;
  allows_write_to_pm: boolean;
  photo_url?: string;
}
