import { bot } from '../services/botService';

// Generic callback query logger for debugging
bot.on('callback_query', (ctx, next) => {
  console.log(`[${new Date().toISOString()}] Received callback query:`, (ctx.callbackQuery as any).data);
  return next();
});

import { findOrCreateUser, updateNotificationSettings, updateUserLanguage } from '../services/userService';
import { getOrCreateTodayChecklist, updateChecklistItem, getCustomizedChecklistItems, getUserProgressSummary, getDailyTip } from '../services/mockServices';
import { mainMenuKeyboard, checklistMenuKeyboard, wisdomMenuKeyboard, herbalMenuKeyboard, healthMenuKeyboard, journalMenuKeyboard, settingsMenuKeyboard, healingMenuKeyboard } from './ui';
import { handleError } from '../utils/errorHandler';
import { t, supportedLangs, SupportedLang } from '../utils/i18n';
import { isAdmin } from '../config/admin';
import { setUserState, getUserState, clearUserState, UserState } from '../services/stateService';
import { getRandomWisdomQuote, getRandomHerbalTip, getRandomHealingTip, saveJournalEntry, countJournalEntries } from '../services/mockServices';
import { getGoalSpecificJournalPrompt, getGoalSpecificQuote, getDailyContent } from '../services/contentEngine';
import { getOptimalRecommendations } from '../services/webContentService';
import { getHealthGuidance, getAvailableSymptoms } from '../services/healthGuidanceService';
import { getUserHealingGoals, generate21DayPlan, updateUserStreak, getOrCreateProgressTracking } from '../services/mockUserService';
import { handleBotError } from '../utils/errorHandler';

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
    handleBotError(ctx, error);
  }
});

// Main menu callbacks
bot.action('wisdom_quote', async (ctx) => {
  try {
    await retryOperation(async () => {
      const user = await findOrCreateUser(ctx.from);
      
      // Get goal-specific wisdom quote
      let quote = getGoalSpecificQuote(user);
      
      // Fallback to random quote if needed
      if (!quote) {
        quote = await getRandomWisdomQuote();
        if (!quote || quote.includes('Could not fetch')) {
          quote = 'Could not fetch a wisdom quote at this time. Here is one from Ibn Sina:\n"The body is the boat that carries us through life; we must keep it in good repair."';
        }
      }
      
      await ctx.editMessageText(`📜 Wisdom Quote:\n${quote}`, { 
        parse_mode: 'Markdown', 
        reply_markup: wisdomMenuKeyboard.reply_markup 
      });
      await ctx.answerCbQuery('Wisdom quote provided');
    });
  } catch (error) {
    handleBotError(ctx, error);
  }
});

bot.action('herbal_tips', async (ctx) => {
  try {
    await retryOperation(async () => {
      const tipObj = await getRandomHerbalTip();
      const tipText = `🌿 **Herbal Tip**

**${tipObj.herb_name}**
${tipObj.tip_text}

**Benefits:**
${tipObj.benefits.map((b: string) => '• ' + b).join('\n')}

**Usage:** ${tipObj.usage_instructions}
⚠️ **Precautions:** ${tipObj.precautions}`;
      await ctx.editMessageText(tipText, { 
        parse_mode: 'Markdown', 
        reply_markup: herbalMenuKeyboard.reply_markup 
      });
      await ctx.answerCbQuery('Herbal tip provided');
    });
  } catch (error) {
    handleBotError(ctx, error);
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
    handleBotError(ctx, error);
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
    handleBotError(ctx, error);
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
      await ctx.editMessageText(checklistMsg, { parse_mode: 'Markdown', reply_markup: checklistMenuKeyboard(checklist).reply_markup });
      await ctx.answerCbQuery('Checklist loaded');
    });
  } catch (error) {
    handleBotError(ctx, error);
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
    handleBotError(ctx, error);
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
          const progress = await getOrCreateProgressTracking(user.id);
    const journalCount = await countJournalEntries(user.id);
      const statsMsg = `📊 ${t(lang, 'main_menu')} Stats\n\n` +
        `🔥 Current Streak: ${progress.current_streak} days\n` +
        `🏅 Longest Streak: ${progress.longest_streak} days\n` +
        `✅ Days Completed: ${progress.total_days_completed}\n` +
        `📖 Journal Entries: ${journalCount}`;
      await ctx.editMessageText(statsMsg, { parse_mode: 'Markdown', reply_markup: mainMenuKeyboard.reply_markup });
      await ctx.answerCbQuery('Stats loaded');
    });
  } catch (error) {
    handleBotError(ctx, error);
  }
});

bot.action('settings_menu', async (ctx) => {
  try {
    await retryOperation(async () => {
      const user = await findOrCreateUser(ctx.from);
      await ctx.editMessageText('⚙️ Settings\n\nWelcome to your settings panel! Here you can customize your healing journey experience.', { parse_mode: 'Markdown', reply_markup: settingsMenuKeyboard.reply_markup });
      await ctx.answerCbQuery('Settings menu loaded');
    });
  } catch (error) {
    handleBotError(ctx, error);
  }
});

// Optimal recommendations with web content
bot.action('optimal_recommendations', async (ctx) => {
  try {
    await retryOperation(async () => {
      const user = await findOrCreateUser(ctx.from);
      const goalTags = user.goal_tags as any || { general: true };
      
      // Get user's location
      const userLocation = user.timezone?.split('/')[1] || 'Lagos';
      
      // Get optimal recommendations from web
      const recommendations = await getOptimalRecommendations(goalTags, undefined, userLocation);
      
      let response = `🤖 **Optimal Recommendations for You**\n\n`;
      
      if (recommendations.herbalTip) {
        response += `${recommendations.herbalTip}\n\n`;
      }
      
      if (recommendations.healthAdvice) {
        response += `${recommendations.healthAdvice}\n\n`;
      }
      
      if (recommendations.weatherTip) {
        response += `${recommendations.weatherTip}\n\n`;
      }
      
      if (recommendations.newsInsight) {
        response += `${recommendations.newsInsight}\n\n`;
      }
      
      if (recommendations.aiSuggestion) {
        response += `${recommendations.aiSuggestion}\n\n`;
      }
      
      // If no web content available, provide fallback
      if (Object.keys(recommendations).length === 0) {
        response += `💡 **Personalized Tip**: Based on your goals, here's a custom recommendation:\n\n`;
        const dailyContent = getDailyContent(user, user.current_day);
        response += `${dailyContent.tip}\n\n`;
        response += `📜 **Wisdom**: ${dailyContent.quote}`;
      }
      
      await ctx.editMessageText(response, { 
        parse_mode: 'Markdown', 
        reply_markup: mainMenuKeyboard.reply_markup 
      });
      await ctx.answerCbQuery('Optimal recommendations provided');
    });
  } catch (error) {
    handleBotError(ctx, error);
  }
});

// Journal: Add new entry with goal-specific prompt
bot.action('journal_add_new', async (ctx) => {
  try {
    await retryOperation(async () => {
      const user = await findOrCreateUser(ctx.from);
      const userId = ctx.from?.id;
      
      if (!userId) return;
      
      // Get goal-specific journal prompt
      const journalPrompt = getGoalSpecificJournalPrompt(user);
      
      setUserState(userId, UserState.AWAITING_JOURNAL_ENTRY);
      
      await ctx.editMessageText(`📝 **New Journal Entry**

💭 **Today's Reflection Prompt:**
"${journalPrompt}"

✍️ Please share your thoughts below. You can write as much or as little as feels right to you.

❌ To cancel, type "cancel"`, { 
        parse_mode: 'Markdown', 
        reply_markup: { inline_keyboard: [[{ text: '❌ Cancel', callback_data: 'cancel_journal' }]] }
      });
      await ctx.answerCbQuery('Journal prompt provided');
    });
  } catch (error) {
    handleBotError(ctx, error);
  }
});

// Menu navigation callbacks


































 

// Journal: Show history (paginated)


// Journal: View entry


// Journal: Edit entry (start editing)


// Journal: Delete entry (confirmation)


// Journal: Delete entry (confirmed)
 

 

 









 