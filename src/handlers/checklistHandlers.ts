import { bot } from '../services/botService';
import { findOrCreateUser, getOrCreateProgressTracking } from '../services/userService';
import { getOrCreateTodayChecklist, updateChecklistItem } from '../services/checklistService';
import { updateDailyProgress, getProgressSummary } from '../services/streakService';
import { getDailyContent } from '../services/contentEngine';
import { checklistMenuKeyboard } from './ui';
import { handleBotError } from '../utils/errorHandler';

async function handleChecklistToggle(ctx: any, itemId: string) {
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
    
    // Find the current item to toggle
    const currentItem = checklist.checklist_items.find(item => item.id === itemId);
    if (!currentItem) {
      await ctx.answerCbQuery('Item not found.');
      return;
    }
    
    const updatedChecklist = await updateChecklistItem(checklist.id, itemId, !currentItem.completed);
    
    // Get progress tracking for detailed stats
    const progress = await getOrCreateProgressTracking(user);
    const progressSummary = getProgressSummary(user, progress);
    
    const progressBar = '▓'.repeat(Math.round(updatedChecklist.completion_percentage / 20)) + '░'.repeat(5 - Math.round(updatedChecklist.completion_percentage / 20));
    
    const checklistMsg = `
${updatedChecklist.daily_focus}

${progressBar} ${updatedChecklist.completion_percentage}% Complete

**Today's Healing Rituals:**
${updatedChecklist.checklist_items.map((item) => {
  return `${item.text} [${item.completed ? '✅' : '❌'}]`;
}).join('\n')}

💡 **Today's Tip:** ${updatedChecklist.daily_tip}

📜 **Wisdom:** ${updatedChecklist.daily_quote}

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

bot.action(/^toggle_item_(.+)$/, async (ctx) => {
  const itemId = ctx.match[1];
  await handleChecklistToggle(ctx, itemId);
});