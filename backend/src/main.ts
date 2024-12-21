import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppConfig } from './app.config';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { Telegraf } from 'telegraf';
import { getBotToken } from 'nestjs-telegraf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const configService = app.get(ConfigService);

  const adress = configService.get<AppConfig['APP_ADDRESS']>('APP_ADDRESS')!;
  const port = configService.get<AppConfig['APP_PORT']>('APP_PORT');

  app.use(cookieParser());

  const allowedHeaders = configService.get<AppConfig['CORS_ALLOWED_HEADERS']>(
    'CORS_ALLOWED_HEADERS',
  );
  const credentials =
    configService.get<AppConfig['CORS_CREDENTIALS']>('CORS_CREDENTIALS');
  const methods = configService.get<AppConfig['CORS_METHODS']>('CORS_METHODS');
  const origin = configService.get<AppConfig['CORS_ORIGIN']>('CORS_ORIGIN');
  app.enableCors({
    origin: [
      origin,
      'http://localhost:3001',
      'http://0.0.0.127:3001',
      'https://5878-79-104-4-214.ngrok-free.app',
    ],
    credentials,
    allowedHeaders,
    methods,
  });

  const webhookPath =
    configService.get<AppConfig['BOT_WEBHOOK_PATH']>('BOT_WEBHOOK_PATH');
  if (webhookPath) {
    const bot: Telegraf = app.get(getBotToken());
    app.use(bot.webhookCallback(webhookPath));
  }

  await app.listen(port, adress);
}
bootstrap();
