
import { bot } from '../services/botService';
import { getRandomHerbalTip } from '../services/herbalService';
import { herbalMenuKeyboard } from './ui';
import { handleError } from '../utils/errorHandler';

// Herbal tip: Another tip
bot.action('herbal_another_tip', async (ctx) => {
  try {
    const chatId = ctx.chat?.id;
    const messageId = ctx.callbackQuery.message?.message_id;
    if (!chatId || !messageId) return;
    
    const tip = await getRandomHerbalTip();
    
    await ctx.editMessageText(tip, { reply_markup: herbalMenuKeyboard.reply_markup });
    await ctx.answerCbQuery('Here is another herbal wisdom!');
  } catch (error) {
    handleError(ctx, error, 'Error fetching herbal tip.');
  }
});
