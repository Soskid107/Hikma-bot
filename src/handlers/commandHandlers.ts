import { bot } from '../services/botService';
import { getOrCreateTodayChecklist, updateChecklistItem, getRandomChecklistTip } from '../services/checklistService';
import { getUserProgressSummary, getDailyTip, getCustomizedChecklistItems } from '../services/healingPlanService';
import { saveJournalEntry, countJournalEntries } from '../services/journalService';
import { getRandomWisdomQuote } from '../services/wisdomService';
import { getRandomHerbalTip, addHerbalTip } from '../services/herbalService';
import { getRandomHealingTip } from '../services/db/healingTipService';
import { getHealthGuidance, getAvailableSymptoms } from '../services/healthGuidanceService';
import { findOrCreateUser, getUserHealingGoals, generate21DayPlan, updateUserStreak, getOrCreateProgressTracking, getAllActiveUsers } from '../services/userService';
import { t } from '../utils/i18n';
import { isAdmin } from '../config/admin';
import { mainMenuKeyboard, journalMenuKeyboard, settingsMenuKeyboard, wisdomMenuKeyboard, checklistMenuKeyboard, herbalMenuKeyboard, healthMenuKeyboard, healingMenuKeyboard } from './ui';
import AppDataSource from '../config/data-source';
import { User } from '../entities/User';
import { handleBotError } from '../utils/errorHandler';
import { HerbalTip } from '../entities/HerbalTip';

const supportedLangs = ['en', 'fr', 'ar', 'sw'] as const;
type SupportedLang = typeof supportedLangs[number];


import { setUserState, getUserState, clearUserState, UserState } from '../services/stateService';


// Start command
bot.command('start', async (ctx) => {
  try {
    const chatId = ctx.chat.id;
    const telegramUser = ctx.from;
    let firstName = telegramUser?.first_name || 'friend';

    // Register or update the user in the database
    let user = await findOrCreateUser(telegramUser);

    // Check if user already has healing goals
    if (user.healing_goals && Object.keys(user.healing_goals).length > 0) {
      // Existing user - show main menu directly
      const mainMenu = `🕯️ Welcome back, ${firstName}!\n\nChoose your healing path:`;

      await ctx.reply(mainMenu, { parse_mode: 'Markdown', reply_markup: mainMenuKeyboard.reply_markup });
    } else {
      // New user - show onboarding
      const welcomeMessage = `🕯️ Welcome to Hikma - Your Healing Journey Begins!

السلام عليكم وبركاته

I am Hikma, your companion on a 21-day healing journey inspired by the wisdom of Ibn Sina (Avicenna), the greatest physician of the Islamic Golden Age.

Ready to begin your transformation?`;

      await ctx.reply(welcomeMessage, { parse_mode: 'Markdown', reply_markup: { inline_keyboard: [ [ { text: '🚀 Yes, I\'m Ready!', callback_data: 'onboarding_ready' }, { text: 'ℹ️ Learn More', callback_data: 'onboarding_learn_more' } ] ] } });
    }
  } catch (error) {
    handleBotError(ctx, error);
  }
});

// Menu command
bot.command('menu', async (ctx) => {
  try {
    const user = await findOrCreateUser(ctx.from);
    const firstName = user.first_name || 'friend';
    
    const mainMenu = `🕯️ Welcome back, ${firstName}!\n\nChoose your healing path:`;

    await ctx.reply(mainMenu, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '📜 Wisdom Quote', callback_data: 'wisdom_quote' },
            { text: '🌿 Herbal Tips', callback_data: 'herbal_tips' }
          ],
          [
            { text: '📝 Journal', callback_data: 'journal_menu' },
            { text: '💡 Healing Tip', callback_data: 'healing_tip' }
          ],
          [
            { text: '📋 Daily Checklist', callback_data: 'daily_checklist' },
            { text: '🏥 Health Guidance', callback_data: 'health_guidance' }
          ],
          [
            { text: '📊 My Stats', callback_data: 'my_stats' },
            { text: '⚙️ Settings', callback_data: 'settings_menu' }
          ]
        ]
      }
    });
  } catch (error) {
    handleBotError(ctx, error);
  }
});

// Add onboarding_ready callback to show main menu after onboarding
bot.action('onboarding_ready', async (ctx) => {
  try {
    const user = await findOrCreateUser(ctx.from);
    
    // Check if user already has healing goals
    if (user.healing_goals && Object.keys(user.healing_goals).length > 0) {
      // Existing user - show main menu directly
      const firstName = user.first_name || 'friend';
      const mainMenu = `🕯️ Welcome back, ${firstName}!\n\nChoose your healing path:`;

      await ctx.reply(mainMenu, { parse_mode: 'Markdown', reply_markup: mainMenuKeyboard.reply_markup });
      await ctx.answerCbQuery('Welcome back!');
    } else {
      // New user - ask for healing goals
      const userId = ctx.from?.id;
      if (userId) {
        setUserState(userId, UserState.AWAITING_HEALING_GOALS);
      }
      await ctx.reply('🌱 Before we begin, what is your main healing goal for the next 21 days?\n\nExamples: Improve digestion, reduce stress, better sleep, boost energy, spiritual growth, etc.\n\nPlease type your goal(s) below:', { parse_mode: 'Markdown', reply_markup: undefined });
      await ctx.answerCbQuery();
    }
  } catch (error) {
    handleBotError(ctx, error);
  }
});

// Add onboarding_learn_more callback
bot.action('onboarding_learn_more', async (ctx) => {
  try {
    await ctx.reply('🕯️ About Hikma - Your Healing Companion\n\nI am inspired by the wisdom of Ibn Sina (Avicenna), the greatest physician of the Islamic Golden Age. My approach combines:\n\n🌿 Traditional Herbal Medicine\n🧘 Spiritual Wellness\n💭 Philosophical Reflection\n📝 Mindful Journaling\n📋 Daily Healing Rituals\n\nThis 21-day journey will help you:\n• Establish healthy daily routines\n• Learn about natural healing methods\n• Reflect on your spiritual and physical well-being\n• Build lasting wellness habits\n\nReady to begin your transformation?', { parse_mode: 'Markdown', reply_markup: { inline_keyboard: [ [ { text: '🚀 Yes, I\'m Ready!', callback_data: 'onboarding_ready' } ] ] } });
    ctx.answerCbQuery();
  } catch (error) {
    handleBotError(ctx, error);
  }
});







async function sendWisdomQuote(ctx: any) {
  try {
    let quote = await getRandomWisdomQuote();
    if (!quote || quote.includes('Could not fetch')) {
      quote = 'Could not fetch a wisdom quote at this time. Here is one from Ibn Sina:\n"The body is the boat that carries us through life; we must keep it in good repair."';
    }
    await ctx.reply('📜 Wisdom Quote:\n' + quote, { parse_mode: 'Markdown', reply_markup: wisdomMenuKeyboard.reply_markup });
  } catch (error) {
    handleBotError(ctx, error);
  }
}

// Wisdom command
bot.command('wisdom', async (ctx) => {
  await sendWisdomQuote(ctx);
});




async function sendChecklist(ctx: any) {
  const telegramUser = ctx.from;
  try {
    const user = await findOrCreateUser(telegramUser);
    const checklist = await getOrCreateTodayChecklist(user);
    const progressBar = '▓'.repeat(Math.round(checklist.completion_percentage / 20)) + '░'.repeat(5 - Math.round(checklist.completion_percentage / 20));
    const checklistMsg = `
🕯️ Day ${user.current_day} - "Purify the Liver"
السلام عليكم! Time for your healing checklist

Morning Rituals:
💧 Warm Water (500ml) [${checklist.warm_water ? '✅' : '❌'}]
🌿 Black Seed + Garlic [${checklist.black_seed_garlic ? '✅' : '❌'}]
🥗 Light Food Before 8pm [${checklist.light_food_before_8pm ? '✅' : '❌'}]
😴 Sleep by 10pm [${checklist.sleep_time ? '✅' : '❌'}]
🧘 5-min Thought Clearing [${checklist.thought_clearing ? '✅' : '❌'}]

Progress: ${progressBar} ${checklist.completion_percentage}% Complete
`;
    await ctx.reply('📋 Daily Checklist:\n' + checklistMsg, { parse_mode: 'Markdown', reply_markup: checklistMenuKeyboard(checklist).reply_markup });
  } catch (error) {
    handleBotError(ctx, error);
  }
}

// Checklist command
bot.command('checklist', async (ctx) => {
  await sendChecklist(ctx);
});

// ... (rest of the file)



async function sendHerbalTip(ctx: any) {
  try {
    const tipText = await getRandomHerbalTip();
    await ctx.reply('🌿 Herbal Tip:\n' + tipText, { parse_mode: 'Markdown', reply_markup: herbalMenuKeyboard.reply_markup });
  } catch (error) {
    handleBotError(ctx, error);
  }
}

// Herbal tip command
bot.command('herbtip', async (ctx) => {
  await sendHerbalTip(ctx);
});




async function sendJournalMenu(ctx: any) {
  try {
    await ctx.reply('📝 Journal Menu:\nWhat would you like to do?', { parse_mode: 'Markdown', reply_markup: journalMenuKeyboard.reply_markup });
  } catch (error) {
    handleBotError(ctx, error);
  }
}

// Journal command
bot.command('journal', async (ctx) => {
  await sendJournalMenu(ctx);
});





async function sendHealthGuidance(ctx: any) {
  try {
    const args = ctx.message?.text?.split(' ').slice(1);
    if (!args || args.length === 0) {
      const availableSymptoms = await getAvailableSymptoms();
      ctx.reply(`🏥 **Health Guidance System**\n\nI can provide educational information about common symptoms and wellness advice.\n\n📋 **Available Symptoms:**\n${availableSymptoms.map((symptom: string) => `• ${symptom.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}`).join('\n')}\n\n💡 **How to use:**\n/health [symptom]\nExample: /health headache\n\n⚠️ **Important:** This is educational information only and should not replace professional medical advice. Always consult a qualified healthcare provider for proper diagnosis and treatment.`, { parse_mode: 'Markdown', reply_markup: healthMenuKeyboard.reply_markup });
      return;
    }
    
    const symptom = args.join(' ');
    const guidance = await getHealthGuidance(symptom);
    await ctx.reply('🏥 Health Guidance:\n' + guidance, { parse_mode: 'Markdown', reply_markup: healthMenuKeyboard.reply_markup });
  } catch (error) {
    handleBotError(ctx, error);
  }
}

// Health guidance command
bot.command('health', async (ctx) => {
  await sendHealthGuidance(ctx);
});




async function sendHealingTip(ctx: any) {
  try {
    const tipObj: HerbalTip | null = await getRandomHealingTip();
    let tipText = 'No healing tips available at the moment.';
    
    if (tipObj) {
      tipText = `💡 **Healing Tip**

**${tipObj.herb_name || 'Natural Healing'}**
${tipObj.tip_text || 'Focus on your healing journey today.'}

${tipObj.benefits && tipObj.benefits.length > 0 ? `**Benefits:**
${tipObj.benefits.map((b: string) => '• ' + b).join('\n')}` : ''}

${tipObj.usage_instructions ? `**Usage:** ${tipObj.usage_instructions}` : ''}
${tipObj.precautions ? `⚠️ **Precautions:** ${tipObj.precautions}` : ''}`;
    }
    
    await ctx.reply('💡 Healing Tip:\n' + tipText, { parse_mode: 'Markdown', reply_markup: healingMenuKeyboard.reply_markup });
  } catch (error) {
    handleBotError(ctx, error);
  }
}

// Healing tip command
bot.command('healingtip', async (ctx) => {
  await sendHealingTip(ctx);
});


// Healing plan command
bot.command('healingplan', async (ctx) => {
  try {
    const userId = ctx.from?.id;
    if (!userId) return;
    const healingGoals = await getUserHealingGoals(userId);
    const plan = generate21DayPlan(healingGoals);

    if (plan.length === 0) {
      ctx.reply('No healing plan available yet. Please set your healing goals first.');
      return;
    }

    let page = 1;
    const pageSize = 5;
    const totalPages = Math.ceil(plan.length / pageSize);
    const showPage = (pageNum: number) => {
      const start = (pageNum - 1) * pageSize;
      const end = start + pageSize;
      const days = plan.slice(start, end).map((tip, i) => `Day ${start + i + 1}: ${tip}`).join('\n\n');
      ctx.reply(`🗓️ *Your 21-Day Healing Plan* (Page ${pageNum}/${totalPages})\n\n${days}`, {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              ...(pageNum > 1 ? [{ text: '⬅️ Prev', callback_data: `healingplan_page_${pageNum - 1}` }] : []),
              ...(pageNum < totalPages ? [{ text: 'Next ➡️', callback_data: `healingplan_page_${pageNum + 1}` }] : [])
            ],
            [
              { text: '🏠 Back to Main Menu', callback_data: 'back_to_main_menu' }
            ]
          ]
        }
      });
    };
    showPage(page);
  } catch (error) {
    handleBotError(ctx, error);
  }
});

// Main menu button handler
bot.hears('🗓️ Healing Plan', async (ctx) => {
  try {
    ctx.telegram.sendMessage(ctx.chat.id, '/healingplan');
  } catch (error) {
    handleBotError(ctx, error);
  }
});



// Menu button handlers
bot.hears("📋 Today's Checklist", async (ctx) => {
  try {
    await sendChecklist(ctx);
  } catch (error) {
  handleBotError(ctx, error);
  }
});

bot.hears('📜 Wisdom Quote', async (ctx) => {
  try {
    await sendWisdomQuote(ctx);
  } catch (error) {
    handleBotError(ctx, error);
  }
});

bot.hears('🌿 Herbal Tips', async (ctx) => {
  try {
    await sendHerbalTip(ctx);
  } catch (error) {
    handleBotError(ctx, error);
  }
});

bot.hears('🏥 Health Guidance', async (ctx) => {
  try {
    await sendHealthGuidance(ctx);
  } catch (error) {
    handleBotError(ctx, error);
  }
});

bot.hears('📝 Journal', async (ctx) => {
  try {
    await sendJournalMenu(ctx);
  } catch (error) {
    handleBotError(ctx, error);
  }
});

bot.hears('💡 Healing Tip', async (ctx) => {
  try {
    await sendHealingTip(ctx);
  } catch (error) {
    handleBotError(ctx, error);
  }
});



async function sendSettingsMenu(ctx: any) {
  try {
    const user = await findOrCreateUser(ctx.from);
    
    await ctx.reply('⚙️ Settings\n\nWelcome to your settings panel! Here you can customize your healing journey experience.', { parse_mode: 'Markdown', reply_markup: settingsMenuKeyboard.reply_markup });
  } catch (error) {
    handleBotError(ctx, error);
  }
}

bot.command('settings', async (ctx) => {
  await sendSettingsMenu(ctx);
});
bot.hears('⚙️ Settings', async (ctx) => {
  await sendSettingsMenu(ctx);
});



bot.command('addtip', async (ctx) => {
  try {
    const userId = ctx.from?.id;
    if (!userId) {
      ctx.reply('❌ Unable to identify user.');
      return;
    }
    if (!isAdmin(userId)) {
      ctx.reply('❌ You are not authorized to use this command.');
      return;
    }
    setUserState(userId, UserState.AWAITING_TIP_INPUT);
    ctx.reply('📝 Please send the healing tip text you want to add.');
  } catch (error) {
    handleBotError(ctx, error);
  }
});



bot.command('mystats', async (ctx) => {
  try {
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
    await ctx.reply(statsMsg, { parse_mode: 'Markdown', reply_markup: mainMenuKeyboard.reply_markup });
  } catch (error) {
    handleBotError(ctx, error);
  }
});

bot.hears('📊 My Stats', async (ctx) => {
  try {
    ctx.telegram.sendMessage(ctx.chat.id, '/mystats');
  } catch (error) {
    handleBotError(ctx, error);
  }
});

// Handle healing goals input after onboarding
bot.on('text', async (ctx) => {
  const userId = ctx.from?.id;
  if (!userId) return;
  const state = getUserState(userId);
  if (state && state.state === UserState.AWAITING_HEALING_GOALS) {
    try {
      // Save healing goals (mock version)
      const user = await findOrCreateUser(ctx.from);
      const userRepo = AppDataSource.getRepository(User);
      user.healing_goals = { goals: ctx.message.text };
      await userRepo.save(user);
      clearUserState(userId);
      // Show main menu
      await ctx.reply('🌱 Your healing goals have been saved! Here is your main menu:', {
        reply_markup: {
          inline_keyboard: [
            [
              { text: '📜 Wisdom Quote', callback_data: 'wisdom_quote' },
              { text: '🌿 Herbal Tips', callback_data: 'herbal_tips' }
            ],
            [
              { text: '📝 Journal', callback_data: 'journal_menu' },
              { text: '💡 Healing Tip', callback_data: 'healing_tip' }
            ],
            [
              { text: '📋 Daily Checklist', callback_data: 'daily_checklist' },
              { text: '🏥 Health Guidance', callback_data: 'health_guidance' }
            ],
            [
              { text: '📊 My Stats', callback_data: 'my_stats' },
              { text: '⚙️ Settings', callback_data: 'settings_menu' }
            ]
          ]
        },
        parse_mode: 'Markdown'
      });
    } catch (error) {
      handleBotError(ctx, error);
    }
  }
});
