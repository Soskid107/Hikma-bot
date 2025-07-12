import { bot } from '../services/botService';

// Generic callback query logger for debugging
bot.on('callback_query', (ctx, next) => {
  console.log(`[${new Date().toISOString()}] Received callback query:`, (ctx.callbackQuery as any).data);
  return next();
});

import { findOrCreateUser, updateNotificationSettings, updateUserLanguage } from '../services/userService';
import { getOrCreateTodayChecklist, updateChecklistItem } from '../services/checklistService';
import { getCustomizedChecklistItems, getUserProgressSummary, getDailyTip } from '../services/healingPlanService';
import { mainMenuKeyboard, checklistMenuKeyboard, wisdomMenuKeyboard, herbalMenuKeyboard, healthMenuKeyboard, journalMenuKeyboard, settingsMenuKeyboard, healingMenuKeyboard } from './ui';
import { handleError } from '../utils/errorHandler';
import { t, supportedLangs, SupportedLang } from '../utils/i18n';
import { User } from '../entities/User';
import { isAdmin } from '../config/admin';
import { setUserState, getUserState, clearUserState, UserState } from '../services/stateService';
import { getRandomWisdomQuote } from '../services/wisdomService';
import { getRandomHerbalTip, getRandomHealingTip } from '../services/herbalService';
import { saveJournalEntry } from '../services/journalService';
import { getHealthGuidance, getAvailableSymptoms } from '../services/healthGuidanceService';
import { getUserHealingGoals, generate21DayPlan, updateUserStreak, getOrCreateProgressTracking } from '../services/userService';
import { countJournalEntries } from '../services/journalService';

const adminIds = (process.env.ADMIN_USER_IDS || '').split(',').map(id => id.trim()).filter(Boolean).map(Number);

// Helper function to retry operations
async function retryOperation<T>(operation: () => Promise<T>, maxRetries: number = 3, delay: number = 1000): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      console.log(`Retry ${i + 1}/${maxRetries} failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2; // Exponential backoff
    }
  }
  throw new Error('Max retries exceeded');
}

// Back to main menu
bot.action('back_to_main_menu', async (ctx) => {
  try {
    const user = await findOrCreateUser(ctx.from);
    const firstName = user.first_name || 'friend';
    
    const mainMenu = `🕯️ Welcome back, ${firstName}!\n\nChoose your healing path:`;

    await ctx.editMessageText(mainMenu, {
      parse_mode: 'Markdown',
      reply_markup: mainMenuKeyboard.reply_markup
    });
    await ctx.answerCbQuery('Back to main menu');
  } catch (error) {
    handleError(ctx, error, 'Error returning to main menu.');
  }
});

// Main menu callbacks
bot.action('wisdom_quote', async (ctx) => {
  try {
    await retryOperation(async () => {
      let quote = await getRandomWisdomQuote();
      if (!quote || quote.includes('Could not fetch')) {
        quote = 'Could not fetch a wisdom quote at this time. Here is one from Ibn Sina:\n"The body is the boat that carries us through life; we must keep it in good repair."';
      }
      await ctx.editMessageText(`📜 Wisdom Quote:\n${quote}`, { 
        parse_mode: 'Markdown', 
        reply_markup: wisdomMenuKeyboard.reply_markup 
      });
      await ctx.answerCbQuery('Wisdom quote provided');
    });
  } catch (error) {
    handleError(ctx, error, 'Error sending wisdom quote.');
  }
});

bot.action('herbal_tips', async (ctx) => {
  try {
    await retryOperation(async () => {
      const tip = await getRandomHerbalTip();
      await ctx.editMessageText(tip, { 
        parse_mode: 'Markdown', 
        reply_markup: herbalMenuKeyboard.reply_markup 
      });
      await ctx.answerCbQuery('Herbal tip provided');
    });
  } catch (error) {
    handleError(ctx, error, 'Error sending herbal tip.');
  }
});

bot.action('journal_menu', async (ctx) => {
  try {
    await retryOperation(async () => {
      await ctx.editMessageText('📝 Journal Menu:\nWhat would you like to do?', { 
        parse_mode: 'Markdown', 
        reply_markup: journalMenuKeyboard.reply_markup 
      });
      await ctx.answerCbQuery('Journal menu loaded');
    });
  } catch (error) {
    handleError(ctx, error, 'Error sending journal menu.');
  }
});

bot.action('healing_tip', async (ctx) => {
  try {
    await retryOperation(async () => {
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
      
      await ctx.editMessageText(tipText, { 
        parse_mode: 'Markdown', 
        reply_markup: healingMenuKeyboard.reply_markup 
      });
      await ctx.answerCbQuery('Healing tip provided');
    });
  } catch (error) {
    handleError(ctx, error, 'Error sending healing tip.');
  }
});

bot.action('daily_checklist', async (ctx) => {
  try {
    await retryOperation(async () => {
      const telegramUser = ctx.from;
      const user = await findOrCreateUser(telegramUser);
      const checklist = await getOrCreateTodayChecklist(user);
      
      // Get customized checklist items for this day
      const customizedItems = getCustomizedChecklistItems(user);
      const progressSummary = getUserProgressSummary(user);
      const dailyTip = getDailyTip(user);
      
      const progressBar = '▓'.repeat(Math.round(checklist.completion_percentage / 20)) + '░'.repeat(5 - Math.round(checklist.completion_percentage / 20));
      const checklistMsg = `
${progressSummary}

${progressBar} ${checklist.completion_percentage}% Complete

**Today's Healing Rituals:**
💧 ${customizedItems.warm_water} [${checklist.warm_water ? '✅' : '❌'}]
🌿 ${customizedItems.black_seed_garlic} [${checklist.black_seed_garlic ? '✅' : '❌'}]
🥗 ${customizedItems.light_food_before_8pm} [${checklist.light_food_before_8pm ? '✅' : '❌'}]
😴 ${customizedItems.sleep_time} [${checklist.sleep_time ? '✅' : '❌'}]
🧘 ${customizedItems.thought_clearing} [${checklist.thought_clearing ? '✅' : '❌'}]

💡 **Today's Tip:** ${dailyTip}
`;
      await ctx.editMessageText(checklistMsg, { 
        parse_mode: 'Markdown', 
        reply_markup: checklistMenuKeyboard(checklist).reply_markup 
      });
      await ctx.answerCbQuery('Checklist loaded');
    });
  } catch (error) {
    handleError(ctx, error, 'Error loading checklist.');
  }
});

bot.action('health_guidance', async (ctx) => {
  try {
    await retryOperation(async () => {
      const availableSymptoms = getAvailableSymptoms();
      await ctx.editMessageText(`🏥 **Health Guidance System**

I can provide educational information about common symptoms and wellness advice.

📋 **Available Symptoms:**
${availableSymptoms.map(symptom => `• ${symptom.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}`).join('\n')}

💡 **How to use:**
/health [symptom]
Example: /health headache

⚠️ **Important:** This is educational information only and should not replace professional medical advice. Always consult a qualified healthcare provider for proper diagnosis and treatment.`, { 
        parse_mode: 'Markdown',
        reply_markup: healthMenuKeyboard.reply_markup 
      });
      await ctx.answerCbQuery('Health menu loaded');
    });
  } catch (error) {
    handleError(ctx, error, 'Error loading health menu.');
  }
});

bot.action('my_stats', async (ctx) => {
  try {
    await retryOperation(async () => {
      const user = await findOrCreateUser(ctx.from);
      let lang: SupportedLang = 'en';
      if (supportedLangs.includes(user['language_preference'] as SupportedLang)) {
        lang = user['language_preference'] as SupportedLang;
      }
      const progress = await getOrCreateProgressTracking(user);
      const journalCount = await countJournalEntries(user);
      const statsMsg = `📊 ${t(lang, 'main_menu')} Stats\n\n` +
        `🔥 Current Streak: ${progress.current_streak} days\n` +
        `🏅 Longest Streak: ${progress.longest_streak} days\n` +
        `✅ Days Completed: ${progress.total_days_completed}\n` +
        `📖 Journal Entries: ${journalCount}`;
      await ctx.editMessageText(statsMsg, { 
        parse_mode: 'Markdown',
        reply_markup: mainMenuKeyboard.reply_markup 
      });
      await ctx.answerCbQuery('Stats loaded');
    });
  } catch (error) {
    handleError(ctx, error, 'Error fetching stats.');
  }
});

bot.action('settings_menu', async (ctx) => {
  try {
    await retryOperation(async () => {
      const user = await findOrCreateUser(ctx.from);
      await ctx.editMessageText('⚙️ Settings\n\nWelcome to your settings panel! Here you can customize your healing journey experience.', { 
        reply_markup: settingsMenuKeyboard.reply_markup 
      });
      await ctx.answerCbQuery('Settings menu loaded');
    });
  } catch (error) {
    handleError(ctx, error, 'Error loading settings menu.');
  }
});

// Menu navigation callbacks


































 

// Journal: Show history (paginated)


// Journal: View entry


// Journal: Edit entry (start editing)


// Journal: Delete entry (confirmation)


// Journal: Delete entry (confirmed)
 

 

 









 