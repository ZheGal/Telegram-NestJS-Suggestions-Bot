import { Injectable } from '@nestjs/common';
import { DialogService } from 'src/dialog/dialog.service';
import { UserService } from 'src/user/user.service';
import { Context } from 'telegraf';

@Injectable()
export class TelegramService {
  private chatId: string;

  constructor(
    private readonly userService: UserService,
    private readonly dialogService: DialogService,
  ) {
    this.chatId = process.env.SUPERGROUP_ID;
  }

  async onMessage(ctx: Context) {
    const message = ctx.update['message'];
    if (this.isMessageFromUser(message)) {
      return await this.messageFromUser(ctx);
    }
    if (this.isMessageToUser(message)) {
      return await this.messageToUser(ctx);
    }
  }

  async messageFromUser(ctx: Context) {
    const message = ctx.update['message'];
    const { from } = message;
    const user = await this.userService.checkAndCreateUpdateUser(from);
    if (user) {
      const dialog = await this.dialogService.getOrCreateDialogByUser(user);
      if (dialog) {
        try {
          await ctx.forwardMessage(this.chatId, {
            message_thread_id: dialog.id,
          });
        } catch (e) {
          console.log('it was error!');
        }
      }
    }
  }

  async messageToUser(ctx: Context) {
    const message = ctx.update['message'];
    const { message_thread_id: topicId } = message;
    const user = await this.dialogService.getUserByDialogId(topicId);
    if (user) {
      ctx.forwardMessage(user.id);
    }
  }

  isMessageToUser(message: any) {
    const {
      chat: { id },
      from: { is_bot },
    } = message;
    return !is_bot && id === Number(this.chatId);
  }

  isMessageFromUser(message: any) {
    const {
      from: { id: fromId },
      chat: { id: chatId },
    } = message;
    return fromId === chatId;
  }
}
