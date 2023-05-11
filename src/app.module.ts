import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { sessionMiddleware } from './middlewares/session.middleware';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { BotModule } from './bot/bot.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TelegrafModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        token: config.get<string>('TELEGRAM_BOT_TOKEN'),
        botName: config.get<string>('TELEGRAM_BOT_NAME'),
        middlewares: [sessionMiddleware],
      }),
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'sqlite',
        database: config.get<string>('DB_NAME'),
        entitites: [],
        synchronize: true,
      }),
    }),
    UserModule,
    BotModule,
  ],
})
export class AppModule {}
