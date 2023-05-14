import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { sessionMiddleware } from '../middlewares/session.middleware';
import { ConfigService } from '@nestjs/config';
import { TelegramUpdate } from './telegram.update';
import { TelegramService } from './telegram.service';
import { UserModule } from 'src/user/user.module';
import { DialogModule } from 'src/dialog/dialog.module';

@Module({
  imports: [
    UserModule,
    DialogModule,
    TelegrafModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        token: config.get<string>('TELEGRAM_BOT_TOKEN'),
        botName: config.get<string>('TELEGRAM_BOT_NAME'),
        middlewares: [sessionMiddleware],
      }),
    }),
  ],
  providers: [TelegramService, TelegramUpdate],
})
export class TelegramModule {}
