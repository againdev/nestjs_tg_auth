import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { BotResolver } from './bot.resolver';
import { BotUpdate } from './bot.update';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [BotService, BotResolver, BotUpdate],
})
export class BotModule {}
