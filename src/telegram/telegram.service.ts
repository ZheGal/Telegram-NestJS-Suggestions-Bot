import { Injectable } from '@nestjs/common';
import { DialogService } from 'src/dialog/dialog.service';
import { UserService } from 'src/user/user.service';
import { Context } from 'telegraf';

@Injectable()
export class TelegramService {
  constructor(
    private readonly userService: UserService,
    private readonly dialogService: DialogService,
  ) {}

  async onMessage(ctx: Context) {
    if (!this.checkNewMessage(ctx.update['message'])) {
      return false;
    }

    const { from } = ctx.update['message'];
    const user = await this.userService.checkAndCreateUpdateUser(from);
    const dialog = await this.dialogService.getOrCreateDialogByUser(user);

    const chatId = process.env.SUPERGROUP_ID;
    ctx.forwardMessage(chatId, {
      message_thread_id: dialog.id,
    });
  }

  checkNewMessage(message: any) {
    const {
      from: { id: fromId },
      chat: { id: chatId },
    } = message;
    return fromId === chatId;
  }
}
