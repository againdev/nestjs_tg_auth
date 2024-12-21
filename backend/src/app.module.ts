import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppConfig, validateAppConfig } from './app.config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { ApolloServerPlugin } from '@apollo/server';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { NoSchemaIntrospectionCustomRule } from 'graphql';
import { join } from 'path';
import { TelegrafModule } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { UserModule } from './user/user.module';
import { AppResolver } from './app.resolver';
import { BotModule } from './bot/bot.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateAppConfig,
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        let plugins: ApolloServerPlugin<any>[] = [];

        if (
          configService.get<AppConfig['GRAPHQL_ENABLE_IDE']>(
            'GRAPHQL_ENABLE_IDE',
          )
        ) {
          plugins.push(ApolloServerPluginLandingPageLocalDefault({}));
        }

        const validationRules: any[] = [];
        if (
          !configService.get<AppConfig['GRAPHQL_ENABLE_INTROSPECTION']>(
            'GRAPHQL_ENABLE_INTROSPECTION',
          )
        ) {
          validationRules.push(NoSchemaIntrospectionCustomRule);
        }

        return {
          playground: false,
          autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
          sortSchema: true,
          plugins,
          validationRules,
          cors: {
            credentials: true,
            origin: '*',
          },
          context: ({ req, res }) => ({ req, res }),
        };
      },
      inject: [ConfigService],
    }),

    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const BOT_TOKEN =
          configService.get<AppConfig['BOT_TOKEN']>('BOT_TOKEN');
        const BOT_WEBHOOK_DOMAIN =
          configService.get<AppConfig['BOT_WEBHOOK_DOMAIN']>(
            'BOT_WEBHOOK_DOMAIN',
          );
        const BOT_WEBHOOK_PATH =
          configService.get<AppConfig['BOT_WEBHOOK_PATH']>('BOT_WEBHOOK_PATH');
        const BOT_WEBHOOK_SECRET_TOKEN = configService.get<
          AppConfig['BOT_WEBHOOK_SECRET_TOKEN']
        >('BOT_WEBHOOK_SECRET_TOKEN');

        const launchOptions: Telegraf.LaunchOptions = {
          dropPendingUpdates: true,
          allowedUpdates: ['message'],
        };

        if (BOT_WEBHOOK_DOMAIN && BOT_WEBHOOK_PATH) {
          launchOptions.webhook = {
            domain: BOT_WEBHOOK_DOMAIN,
            hookPath: BOT_WEBHOOK_PATH,
            secretToken: BOT_WEBHOOK_SECRET_TOKEN,
          };
        }

        return {
          token: BOT_TOKEN,
          middlewares: [
            async (ctx: Context, next) => {
              if (
                ctx.chat === undefined ||
                ctx.chat.type === 'group' ||
                ctx.chat.type === 'supergroup'
              ) {
                return;
              }

              await next();
            },
          ],
          launchOptions: launchOptions,
        };
      },
      inject: [ConfigService],
    }),

    UserModule,

    BotModule,

    AuthModule,
  ],

  providers: [AppService, AppResolver],
})
export class AppModule {}
