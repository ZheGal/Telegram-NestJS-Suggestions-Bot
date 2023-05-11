import { Telegraf, Context } from 'telegraf';
import { Ctx, InjectBot, On, Update } from 'nestjs-telegraf';
import { TelegramService } from './telegram.service';

@Update()
export class TelegramUpdate {
  constructor(
    private telegramService: TelegramService,
    @InjectBot() private readonly bot: Telegraf<Context>,
  ) {}

  @On('message')
  onMessage(@Ctx() ctx: Context) {
    console.log(ctx.update);
    return this.telegramService.onMessage(ctx);
  }
}
