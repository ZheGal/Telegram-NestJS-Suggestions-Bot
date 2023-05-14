import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Context, Telegraf } from 'telegraf';
import { Dialog } from './dialog.entity';
import { Repository } from 'typeorm';
import { InjectBot } from 'nestjs-telegraf';

@Injectable()
export class DialogService {
  constructor(
    @InjectRepository(Dialog) private dialogRepository: Repository<Dialog>,
    @InjectBot() private readonly bot: Telegraf<Context>,
  ) {}

  async getOrCreateDialogByUser(user: User) {
    const dialog = await this.dialogRepository.findOne({
      where: { user: { id: user.id } },
      relations: ['user'],
    });
    return dialog ?? (await this.createAndSaveNewDialog(user));
  }

  async createAndSaveNewDialog(user: User): Promise<Dialog> {
    const chatId = process.env.SUPERGROUP_ID;
    const { first_name, last_name, username } = user;
    const userName = last_name ? `${first_name} ${last_name}` : first_name;
    const dialogName = username ? `${userName} (${username})` : userName;
    const dialog = await this.bot.telegram.createForumTopic(chatId, dialogName);
    const newDialog = this.dialogRepository.create({
      id: dialog.message_thread_id,
      dialog_name: dialog.name,
      user,
    });
    await this.dialogRepository.save(newDialog);
    return newDialog;
  }
}
