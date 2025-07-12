import { bot } from '../services/botService';
import { findOrCreateUser } from '../services/userService';
import { mainMenuKeyboard, onboardingLearnMoreKeyboard } from './ui';
import { handleError } from '../utils/errorHandler';

// Onboarding: user is ready
bot.action('onboarding_ready', async (ctx) => {
  try {
    const chatId = ctx.chat?.id;
    if (!chatId) return;
    const user = await findOrCreateUser(ctx.from);
    await ctx.reply('Main Menu', { reply_markup: mainMenuKeyboard.reply_markup });
    await ctx.answerCbQuery('Let\'s begin!');
  } catch (error) {
    handleError(ctx, error, 'Error during onboarding.');
  }
});

// Onboarding: learn more
bot.action('onboarding_learn_more', async (ctx) => {
  try {
    const chatId = ctx.chat?.id;
    if (!chatId) return;
    const user = await findOrCreateUser(ctx.from);
    await ctx.reply(`Hikma is a 21-day healing journey inspired by the wisdom of Ibn Sina (Avicenna).

You'll receive daily checklists, wisdom quotes, herbal tips, and gentle reminders to help you purify your body, mind, and spirit.

Ready to begin?`, { 
      reply_markup: onboardingLearnMoreKeyboard.reply_markup 
    });
    await ctx.answerCbQuery('Learn more about Hikma');
  } catch (error) {
    handleError(ctx, error, 'Error learning more about Hikma.');
  }
});