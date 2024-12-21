import { Resolver, Mutation, Args, Context, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthenticateInput } from './auth.dto';
import { GraphqlAuthGuard } from './auth.guard';
import { UserService } from 'src/user/user.service';
import { AuntificateResponse } from './auth.types';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}
  @Mutation(() => Boolean)
  async authenticate(
    @Args('input') input: AuthenticateInput,
    @Context() context: { res: Response },
  ) {
    try {
      console.log('Auntificate');
      const user = this.authService.validateMiniAppInitData(input.initDataRaw);
      await this.authService.updateOrCreateUser(user, context.res);
      return true;
    } catch (error) {
      throw new BadRequestException('Authentication failed');
    }
  }

  @Mutation(() => String)
  async refreshToken(@Context() context: { req: Request; res: Response }) {
    console.log('Refresh');
    try {
      const refreshToken = await this.authService.refreshToken(
        context.req,
        context.res,
      );
      return refreshToken;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(GraphqlAuthGuard)
  @Query(() => AuntificateResponse)
  async getMe(
    @Context() context: { req: Request },
  ): Promise<AuntificateResponse> {
    const userId = context.req.user.sub;

    const user = await this.userService.getUserByUuId(userId);
    const { createdAt, updatedAt, ...userWithoutTimestamps } = user;

    return { user: userWithoutTimestamps };
  }
}
