import { bot } from '../services/botService';
import { getHealthGuidance, getAvailableSymptoms } from '../services/healthGuidanceService';
import { healthMenuKeyboard } from './ui';
import { handleError } from '../utils/errorHandler';

bot.action('health_headache', async (ctx) => {
  try {
    const guidance = await getHealthGuidance('headache');
    await ctx.editMessageText(guidance, { reply_markup: healthMenuKeyboard.reply_markup });
    await ctx.answerCbQuery('Headache guidance provided');
  } catch (error) {
    handleError(ctx, error, 'Error fetching headache guidance.');
  }
});

bot.action('health_fatigue', async (ctx) => {
  try {
    const guidance = await getHealthGuidance('fatigue');
    await ctx.editMessageText(guidance, { reply_markup: healthMenuKeyboard.reply_markup });
    await ctx.answerCbQuery('Fatigue guidance provided');
  } catch (error) {
    handleError(ctx, error, 'Error fetching fatigue guidance.');
  }
});

bot.action('health_digestive_issues', async (ctx) => {
  try {
    const guidance = await getHealthGuidance('digestive_issues');
    await ctx.editMessageText(guidance, { reply_markup: healthMenuKeyboard.reply_markup });
    await ctx.answerCbQuery('Digestive issues guidance provided');
  } catch (error) {
    handleError(ctx, error, 'Error fetching digestive issues guidance.');
  }
});

bot.action('health_sleep_problems', async (ctx) => {
  try {
    const guidance = await getHealthGuidance('sleep_problems');
    await ctx.editMessageText(guidance, { reply_markup: healthMenuKeyboard.reply_markup });
    await ctx.answerCbQuery('Sleep problems guidance provided');
  } catch (error) {
    handleError(ctx, error, 'Error fetching sleep problems guidance.');
  }
});

bot.action('health_stress_anxiety', async (ctx) => {
  try {
    const guidance = await getHealthGuidance('stress_anxiety');
    await ctx.editMessageText(guidance, { reply_markup: healthMenuKeyboard.reply_markup });
    await ctx.answerCbQuery('Stress & anxiety guidance provided');
  } catch (error) {
    handleError(ctx, error, 'Error fetching stress & anxiety guidance.');
  }
});

bot.action('health_menu', async (ctx) => {
  try {
    const availableSymptoms = getAvailableSymptoms();
    await ctx.editMessageText(`🏥 **Health Guidance System**

I can provide educational information about common symptoms and wellness advice.

📋 **Available Symptoms:**
${availableSymptoms.map(symptom => `• ${symptom.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}`).join('\n')}

💡 **How to use:**
/health [symptom]
Example: /health headache

⚠️ **Important:** This is educational information only and should not replace professional medical advice. Always consult a qualified healthcare provider for proper diagnosis and treatment.`, { 
      reply_markup: healthMenuKeyboard.reply_markup 
    });
    await ctx.answerCbQuery('Health menu loaded');
  } catch (error) {
    handleError(ctx, error, 'Error loading health menu.');
  }
});