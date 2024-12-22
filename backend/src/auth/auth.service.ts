import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AppConfig } from 'src/app.config';
import { PrismaService } from 'src/prisma.service';
import {
  createWebAppSecret,
  decodeInitData,
  InitData,
  verifyTelegramWebAppInitData,
} from './auth.utils';
import { Request, Response } from 'express';
import { User } from '@prisma/client';
import { JwtSubject } from './auth.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  validateMiniAppInitData(raw: string): JwtSubject {
    const token = this.configService.get<AppConfig['BOT_TOKEN']>('BOT_TOKEN');
    const initData = decodeInitData(raw);
    const secretKey = createWebAppSecret(token);

    if (!verifyTelegramWebAppInitData(raw, secretKey)) {
      throw new Error('Invalid init data');
    }

    return {
      id: initData.user.id,
      first_name: initData.user.first_name,
      last_name: initData.user.last_name,
      username: initData.user.username,
      is_premium: initData.user.is_premium,
      language_code: initData.user.language_code,
      allows_write_to_pm: initData.user.allows_write_to_pm,
      photo_url: initData.user.photo_url,
      start_param: initData.start_param,
    };
  }

  async refreshToken(req: Request, res: Response) {
    const refreshToken = req.cookies['refresh_token'];

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    let payload;
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<AppConfig['REFRESH_TOKEN_SECRET']>(
          'REFRESH_TOKEN_SECRET',
        ),
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
    const userExists = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!userExists) {
      throw new BadRequestException('User no longer exists');
    }

    const { exp, iat, ...newPayload } = payload;

    const expiresIn = this.configService.get<
      AppConfig['EXPIRES_IN_ACCESS_TOKEN']
    >('EXPIRES_IN_ACCESS_TOKEN');
    const accessToken = this.jwtService.sign(newPayload, {
      secret: this.configService.get<AppConfig['ACCESS_TOKEN_SECRET']>(
        'ACCESS_TOKEN_SECRET',
      ),
      expiresIn,
    });

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    return accessToken;
  }

  private async issueTokens(user: User, response: Response) {
    const payload = { tgId: user.tgId, sub: user.id };

    const accessToken = this.jwtService.sign(
      { ...payload },
      {
        secret: this.configService.get<AppConfig['ACCESS_TOKEN_SECRET']>(
          'ACCESS_TOKEN_SECRET',
        ),
        expiresIn: this.configService.get<AppConfig['EXPIRES_IN_ACCESS_TOKEN']>(
          'EXPIRES_IN_ACCESS_TOKEN',
        ),
      },
    );
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<AppConfig['REFRESH_TOKEN_SECRET']>(
        'REFRESH_TOKEN_SECRET',
      ),
      expiresIn: this.configService.get<AppConfig['EXPIRES_IN_REFRESH_TOKEN']>(
        'EXPIRES_IN_REFRESH_TOKEN',
      ),
    });

    response.cookie('access_token', accessToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
    return { user };
  }

  async updateOrCreateUser(user: JwtSubject, response: Response) {
    const updatedOrCreatedUser = await this.prisma.user.upsert({
      where: { tgId: user.id },
      update: {
        firstName: user.first_name,
        lastName: user.last_name,
        username: user.username,
        isPremium: user.is_premium,
        languageCode: user.language_code,
        allowsWriteToPm: user.allows_write_to_pm,
        photoUrl: user.photo_url,
      },
      create: {
        tgId: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        username: user.username,
        isPremium: user.is_premium,
        languageCode: user.language_code,
        allowsWriteToPm: user.allows_write_to_pm,
        photoUrl: user.photo_url,
      },
    });

    if (!updatedOrCreatedUser) {
      throw new BadRequestException({
        tgId: 'Invalid Telegram ID or User not found',
      });
    }

    this.issueTokens(updatedOrCreatedUser, response);

    return updatedOrCreatedUser;
  }
}
