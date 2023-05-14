import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { TelegramModule } from './telegram/telegram.module';
import { User } from './user/user.entity';
import { DialogModule } from './dialog/dialog.module';
import { Dialog } from './dialog/dialog.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'sqlite',
        database: config.get<string>('DB_NAME'),
        entities: [User, Dialog],
        synchronize: true,
      }),
    }),
    TelegramModule,
    UserModule,
    DialogModule,
  ],
})
export class AppModule {}
