import { bot } from '../services/botService';
import { findOrCreateUser, getOrCreateProgressTracking } from '../services/userService';
import { getOrCreateTodayChecklist, updateChecklistItem } from '../services/checklistService';
import { getCustomizedChecklistItems, getUserProgressSummary, getDailyTip } from '../services/healingPlanService';
import { updateDailyProgress, getProgressSummary } from '../services/streakService';
import { getDailyContent } from '../services/contentEngine';
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
    
    // Update daily progress and streak
    const progressUpdate = await updateDailyProgress(user);
    
    const checklist = await getOrCreateTodayChecklist(user);
    const currentValue = checklist[item as keyof typeof checklist] as boolean;
    const updatedChecklist = await updateChecklistItem(checklist.id, item as any, !currentValue);
    
    // Get personalized daily content based on user's goals
    const dailyContent = getDailyContent(user, user.current_day);
    
    // Get progress tracking for detailed stats
    const progress = await getOrCreateProgressTracking(user);
    const progressSummary = getProgressSummary(user, progress);
    
    const progressBar = '▓'.repeat(Math.round(updatedChecklist.completion_percentage / 20)) + '░'.repeat(5 - Math.round(updatedChecklist.completion_percentage / 20));
    
    const checklistMsg = `
${dailyContent.focus}

${progressBar} ${updatedChecklist.completion_percentage}% Complete

**Today's Healing Rituals:**
${dailyContent.checklist.map((item, index) => {
  const checklistKeys = ['warm_water', 'black_seed_garlic', 'light_food_before_8pm', 'sleep_time', 'thought_clearing'];
  const isCompleted = updatedChecklist[checklistKeys[index] as keyof typeof updatedChecklist] as boolean;
  return `${item} [${isCompleted ? '✅' : '❌'}]`;
}).join('\n')}

💡 **Today's Tip:** ${dailyContent.tip}

📜 **Wisdom:** ${dailyContent.quote}

${progressUpdate.milestone ? `\n🎉 **Milestone Achieved!**\n${progressUpdate.milestone}` : ''}
`;
    
    await ctx.editMessageText(checklistMsg, { parse_mode: 'Markdown', reply_markup: checklistMenuKeyboard(updatedChecklist).reply_markup });
    
    await ctx.answerCbQuery('Checklist updated!');
    
    if (updatedChecklist.completion_percentage === 100) {
      const completionMessage = `🎉 **Congratulations!** You completed today's healing rituals! 

🔥 **Streak:** ${user.current_streak} days
📅 **Day:** ${user.current_day}/21
💎 **Healing Score:** ${progress.healing_score}

Keep up the great work on your journey!`;
      
      await ctx.reply(completionMessage, { parse_mode: 'Markdown' });
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