
import { bot } from '../services/botService';
import { getRandomHerbalTip } from '../services/mockServices';
import { herbalMenuKeyboard } from './ui';
import { handleError } from '../utils/errorHandler';

// Herbal tip: Another tip
bot.action('herbal_another_tip', async (ctx) => {
  try {
    const chatId = ctx.chat?.id;
    const messageId = ctx.callbackQuery.message?.message_id;
    if (!chatId || !messageId) return;
    
    const tipObj = await getRandomHerbalTip();
    const tipText = `🌿 **${tipObj.herb_name}**

${tipObj.tip_text}

**Benefits:**
${tipObj.benefits.map(b => '• ' + b).join('\n')}

**Usage:** ${tipObj.usage_instructions}
${tipObj.precautions ? `⚠️ **Precautions:** ${tipObj.precautions}` : ''}`;
    
    await ctx.editMessageText(tipText, { parse_mode: 'Markdown', reply_markup: herbalMenuKeyboard.reply_markup });
    await ctx.answerCbQuery('Here is another herbal wisdom!');
  } catch (error) {
    handleError(ctx, error, 'Error fetching herbal tip.');
  }
});
