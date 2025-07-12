import { bot } from '../services/botService';
import { findOrCreateUser } from '../services/userService';
import { getRandomWisdomQuote, getWisdomByCategory } from '../services/wisdomService';
import { wisdomMenuKeyboard } from './ui';
import { handleError } from '../utils/errorHandler';

// Wisdom quote: Teach Me More
bot.action('wisdom_teach_me_more', async (ctx) => {
  try {
    const chatId = ctx.chat?.id;
    const messageId = ctx.callbackQuery.message?.message_id;
    if (!chatId || !messageId) return;
    
    const quote = await getRandomWisdomQuote();
    
    await ctx.editMessageText(`📜 Wisdom Quote:\n${quote}`, { reply_markup: wisdomMenuKeyboard.reply_markup });
    await ctx.answerCbQuery('Here is more wisdom!');
  } catch (error) {
    handleError(ctx, error, 'Error fetching wisdom quote.');
  }
});

// Wisdom by category handlers
bot.action('wisdom_healing', async (ctx) => {
  try {
    const chatId = ctx.chat?.id;
    const messageId = ctx.callbackQuery.message?.message_id;
    if (!chatId || !messageId) return;
    
    const quote = await getWisdomByCategory('healing');
    
    await ctx.editMessageText(`🌿 Healing Wisdom:\n${quote}`, { reply_markup: wisdomMenuKeyboard.reply_markup });
    await ctx.answerCbQuery('Healing wisdom for you!');
  } catch (error) {
    handleError(ctx, error, 'Error fetching healing wisdom.');
  }
});

bot.action('wisdom_spiritual', async (ctx) => {
  try {
    const chatId = ctx.chat?.id;
    const messageId = ctx.callbackQuery.message?.message_id;
    if (!chatId || !messageId) return;
    
    const quote = await getWisdomByCategory('spiritual');
    
    await ctx.editMessageText(`🧘 Spiritual Wisdom:\n${quote}`, { reply_markup: wisdomMenuKeyboard.reply_markup });
    await ctx.answerCbQuery('Spiritual wisdom for you!');
  } catch (error) {
    handleError(ctx, error, 'Error fetching spiritual wisdom.');
  }
});

bot.action('wisdom_philosophy', async (ctx) => {
  try {
    const chatId = ctx.chat?.id;
    const messageId = ctx.callbackQuery.message?.message_id;
    if (!chatId || !messageId) return;
    
    const quote = await getWisdomByCategory('philosophy');
    
    await ctx.editMessageText(`💭 Philosophical Wisdom:\n${quote}`, { reply_markup: wisdomMenuKeyboard.reply_markup });
    await ctx.answerCbQuery('Philosophical wisdom for you!');
  } catch (error) {
    handleError(ctx, error, 'Error fetching philosophical wisdom.');
  }
});
