import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Context, Telegraf } from 'telegraf';
import { Dialog } from './dialog.entity';
import { Repository } from 'typeorm';
import { InjectBot } from 'nestjs-telegraf';
import { ForumTopic } from 'telegraf/typings/core/types/typegram';

@Injectable()
export class DialogService {
  constructor(
    @InjectRepository(Dialog) private dialogRepository: Repository<Dialog>,
    @InjectBot() private readonly bot: Telegraf<Context>,
  ) {}

  async getOrCreateDialogByUser(user: User): Promise<Dialog | void> {
    const dialog = await this.findDialogByUser(user);
    if (dialog) {
      return dialog;
    }
    return await this.createAndSaveNewDialog(user);
  }

  async findDialogByUser(user: User) {
    return await this.dialogRepository.findOne({
      where: { user },
      relations: ['user'],
    });
  }

  async createAndSaveNewDialog(user: User): Promise<Dialog | void> {
    const dialog = await this.createNewTelegramDialog(user);
    const newDialog = this.dialogRepository.create({
      id: dialog.message_thread_id,
      dialog_name: dialog.name,
      user,
    });
    await this.dialogRepository.save(newDialog);
    return newDialog;
  }

  async deleteDialog(dialog: Dialog): Promise<null> {
    await this.dialogRepository.delete(dialog);
    return null;
  }

  async createNewTelegramDialog(user: User): Promise<ForumTopic> {
    const chatId = process.env.SUPERGROUP_ID;
    const dialogName = this.generateDialogName(user);
    return await this.bot.telegram.createForumTopic(chatId, dialogName);
  }

  generateDialogName(user: User) {
    const { first_name, last_name, username } = user;
    const userName = last_name ? `${first_name} ${last_name}` : first_name;
    return username ? `${userName} (${username})` : userName;
  }

  async getUserByDialogId(id: number): Promise<User | void> {
    const chatId = process.env.SUPERGROUP_ID;
    const find = await this.dialogRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (find) {
      return find.user;
    }
    await this.bot.telegram.sendMessage(chatId, 'User Not Found', {
      message_thread_id: id,
    });
  }
}
