import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { Context } from 'telegraf';

@Injectable()
export class TelegramService {
  constructor(private readonly userService: UserService) {}

  async onMessage(ctx: Context) {
    const { from } = ctx.update['message'];
    // получить, записать или обновить пользователя
    const user = await this.userService.checkAndCreateUpdateUser(from);

    // получить беседу

    // переслать сообщение в беседу
    ctx.reply('i am here!');
  }
}
