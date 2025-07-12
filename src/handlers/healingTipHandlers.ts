import { bot } from '../services/botService';
import { getRandomHealingTip } from '../services/herbalService';
import { healingMenuKeyboard } from './ui';
import { handleError } from '../utils/errorHandler';

bot.action('healingtip_another', async (ctx) => {
  try {
    const tipObj = await getRandomHealingTip();
    let tipText = 'No healing tips available at the moment.';
    
    if (tipObj) {
      tipText = `💡 **Healing Tip**

**${tipObj.herb_name || 'Natural Healing'}**
${tipObj.tip_text || 'Focus on your healing journey today.'}

${tipObj.benefits && tipObj.benefits.length > 0 ? `**Benefits:**
${tipObj.benefits.map(b => '• ' + b).join('\n')}` : ''}

${tipObj.usage_instructions ? `**Usage:** ${tipObj.usage_instructions}` : ''}
${tipObj.precautions ? `⚠️ **Precautions:** ${tipObj.precautions}` : ''}`;
    }
    
    // Add a timestamp to ensure the message is always different
    const timestamp = new Date().toLocaleTimeString();
    tipText += `\n\n🕐 Generated at ${timestamp}`;
    
    await ctx.editMessageText(tipText, { 
      parse_mode: 'Markdown', 
      reply_markup: healingMenuKeyboard.reply_markup 
    });
    await ctx.answerCbQuery('New healing tip provided');
  } catch (error) {
    handleError(ctx, error, 'Error fetching healing tip.');
  }
});