import { ConfigService } from '@nestjs/config';
import { Context } from 'telegraf';
import { Injectable } from '@nestjs/common';
import { Start, Update } from 'nestjs-telegraf';
import { AppConfig } from 'src/app.config';

@Update()
@Injectable()
export class BotUpdate {
  constructor(private readonly configService: ConfigService) {}

  @Start()
  async startCommand(ctx: Context) {
    const message = 'Hello, i collecting ur data)';
    const button = 'Start';

    console.log(
      this.configService.get<AppConfig['BOT_MINIAPP_LINK']>('BOT_MINIAPP_LINK'),
    );

    await ctx.reply(message, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: button,
              web_app: {
                url: this.configService.get<AppConfig['BOT_MINIAPP_LINK']>(
                  'BOT_MINIAPP_LINK',
                ),
              },
            },
          ],
        ],
      },
    });
  }
}
