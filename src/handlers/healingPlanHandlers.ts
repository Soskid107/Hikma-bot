import { bot } from '../services/botService';import { findOrCreateUser, getUserHealingGoals, generate21DayPlan } from '../services/userService';import { healingPlanPaginationKeyboard } from './ui';
import { handleError } from '../utils/errorHandler';bot.action(/^healingplan_page_(\d+)$/, async (ctx) => {
  try {
    const userId = ctx.from?.id;
    if (!userId) return;
    const page = ctx.match?.[1] ? parseInt(ctx.match[1], 10) : 1;
    const healingGoals = await getUserHealingGoals(userId);
    const plan = generate21DayPlan(healingGoals);
    const pageSize = 5;
    const totalPages = Math.ceil(plan.length / pageSize);
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const days = plan.slice(start, end).map((tip, i) => `Day ${start + i + 1}: ${tip}`).join('\n\n');
    await ctx.editMessageText(`🗓️ *Your 21-Day Healing Plan* (Page ${page}/${totalPages})\n\n${days}`, {
      parse_mode: 'Markdown',
      reply_markup: healingPlanPaginationKeyboard(page, totalPages).reply_markup
    });
    await ctx.answerCbQuery('Plan page loaded');
  } catch (error) {
    handleError(ctx, error, 'Error loading healing plan page.');
  }
});