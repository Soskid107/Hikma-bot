import { bot } from '../services/botService';
import { findOrCreateUser } from '../services/userService';
import { getOrCreateTodayChecklist, updateChecklistItem } from '../services/checklistService';
import { getCustomizedChecklistItems, getUserProgressSummary, getDailyTip } from '../services/healingPlanService';
import { checklistMenuKeyboard } from './ui';
import { handleBotError } from '../utils/errorHandler';

async function handleChecklistToggle(ctx: any, item: string) {
  const chatId = ctx.chat?.id;
  const messageId = ctx.callbackQuery.message?.message_id;
  const telegramUser = ctx.from;
  
  if (!chatId || !messageId) {
    await ctx.answerCbQuery('Invalid action.');
    return;
  }
  
  try {
    const user = await findOrCreateUser(telegramUser);
    const checklist = await getOrCreateTodayChecklist(user);
    const currentValue = checklist[item as keyof typeof checklist] as boolean;
    const updatedChecklist = await updateChecklistItem(checklist.id, item as any, !currentValue);
    
    // Get customized checklist items for this day
    const customizedItems = getCustomizedChecklistItems(user);
    const progressSummary = getUserProgressSummary(user);
    const dailyTip = getDailyTip(user);
    
    const progressBar = '▓'.repeat(Math.round(updatedChecklist.completion_percentage / 20)) + '░'.repeat(5 - Math.round(updatedChecklist.completion_percentage / 20));
    const checklistMsg = `
${progressSummary}

${progressBar} ${updatedChecklist.completion_percentage}% Complete

**Today's Healing Rituals:**
💧 ${customizedItems.warm_water} [${updatedChecklist.warm_water ? '✅' : '❌'}]
🌿 ${customizedItems.black_seed_garlic} [${updatedChecklist.black_seed_garlic ? '✅' : '❌'}]
🥗 ${customizedItems.light_food_before_8pm} [${updatedChecklist.light_food_before_8pm ? '✅' : '❌'}]
😴 ${customizedItems.sleep_time} [${updatedChecklist.sleep_time ? '✅' : '❌'}]
🧘 ${customizedItems.thought_clearing} [${updatedChecklist.thought_clearing ? '✅' : '❌'}]

💡 **Today's Tip:** ${dailyTip}
`;
    
    await ctx.editMessageText(checklistMsg, { parse_mode: 'Markdown', reply_markup: checklistMenuKeyboard(updatedChecklist).reply_markup });
    
    await ctx.answerCbQuery('Checklist updated!');
    
    if (updatedChecklist.completion_percentage === 100) {
      await ctx.reply('🎉 Congratulations! You completed today\'s healing rituals! 🔥\nKeep up the great work on your journey.', { 
        parse_mode: 'Markdown' 
      });
    }
  } catch (error) {
    handleBotError(ctx, error);
  }
}

bot.action(/^toggle_warm_water_\d+$/, async (ctx) => {
  await handleChecklistToggle(ctx, 'warm_water');
});

bot.action(/^toggle_black_seed_garlic_\d+$/, async (ctx) => {
  await handleChecklistToggle(ctx, 'black_seed_garlic');
});

bot.action(/^toggle_light_food_before_8pm_\d+$/, async (ctx) => {
  await handleChecklistToggle(ctx, 'light_food_before_8pm');
});

bot.action(/^toggle_sleep_time_\d+$/, async (ctx) => {
  await handleChecklistToggle(ctx, 'sleep_time');
});

bot.action(/^toggle_thought_clearing_\d+$/, async (ctx) => {
  await handleChecklistToggle(ctx, 'thought_clearing');
});