import { bot } from '../services/botService';
import { findOrCreateUser } from '../services/userService';
import { getOrCreateTodayChecklist, updateChecklistItem } from '../services/checklistService';
import { mainMenuKeyboard } from './commandHandlers';

// Back to main menu
bot.action('back_to_main_menu', async (ctx) => {
  // Try to delete the previous section message for a cleaner chat
  try {
    await ctx.deleteMessage();
  } catch (e) {
    // If unable to delete (e.g., message is too old), fallback to editing
    await ctx.editMessageText('🏠 **Main Menu**\n\nWelcome back! What would you like to do?', {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "📋 Today's Checklist", callback_data: 'menu_checklist' },
            { text: '📜 Wisdom Quote', callback_data: 'menu_wisdom' }
          ],
          [
            { text: '🌿 Herbal Tips', callback_data: 'menu_herbal' },
            { text: '📝 Journal', callback_data: 'menu_journal' }
          ],
          [
            { text: '🏥 Health Guidance', callback_data: 'menu_health' },
            { text: '⚙️ Settings', callback_data: 'menu_settings' }
          ]
        ]
      }
    });
  }
  ctx.answerCbQuery('Back to main menu');
});

// Menu navigation callbacks
bot.action('menu_checklist', async (ctx) => {
  const { findOrCreateUser } = await import('../services/userService');
  const { getOrCreateTodayChecklist } = await import('../services/checklistService');
  
  try {
    const user = await findOrCreateUser(ctx.from);
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
    await ctx.editMessageText(checklistMsg, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: `💧 Warm Water ${checklist.warm_water ? '✅' : '❌'}`, callback_data: `toggle_warm_water_${checklist.id}` },
            { text: `🌿 Black Seed + Garlic ${checklist.black_seed_garlic ? '✅' : '❌'}`, callback_data: `toggle_black_seed_garlic_${checklist.id}` }
          ],
          [
            { text: `🥗 Light Food Before 8pm ${checklist.light_food_before_8pm ? '✅' : '❌'}`, callback_data: `toggle_light_food_before_8pm_${checklist.id}` },
            { text: `😴 Sleep by 10pm ${checklist.sleep_time ? '✅' : '❌'}`, callback_data: `toggle_sleep_time_${checklist.id}` }
          ],
          [
            { text: `🧘 Thought Clearing ${checklist.thought_clearing ? '✅' : '❌'}`, callback_data: `toggle_thought_clearing_${checklist.id}` }
          ],
          [
            { text: '🏠 Back to Main Menu', callback_data: 'back_to_main_menu' }
          ]
        ]
      }
    });
    // After handling, try to delete the triggering message
    await ctx.deleteMessage();
  } catch (error) {
    console.error('❌ Error fetching checklist:', error);
    await ctx.editMessageText('Sorry, there was an error fetching your checklist. Please try again later.', {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🏠 Back to Main Menu', callback_data: 'back_to_main_menu' }
          ]
        ]
      }
    });
  }
  ctx.answerCbQuery('Checklist loaded');
});

bot.action('menu_wisdom', async (ctx) => {
  const { getRandomWisdomQuote } = await import('../services/wisdomService');
  const quote = await getRandomWisdomQuote();
  
  await ctx.editMessageText(`📜 Wisdom Quote:\n${quote}`, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🔄 Another Quote', callback_data: 'wisdom_teach_me_more' },
          { text: '🌿 Healing Wisdom', callback_data: 'wisdom_healing' }
        ],
        [
          { text: '🧘 Spiritual Wisdom', callback_data: 'wisdom_spiritual' },
          { text: '💭 Philosophy', callback_data: 'wisdom_philosophy' }
        ],
        [
          { text: '🏠 Back to Main Menu', callback_data: 'back_to_main_menu' }
        ]
      ]
    }
  });
  ctx.answerCbQuery('Wisdom quote loaded');
});

bot.action('menu_herbal', async (ctx) => {
  const { getRandomHerbalTip } = await import('../services/herbalService');
  const tip = await getRandomHerbalTip();
  
  await ctx.editMessageText(tip, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🌿 Another Herbal Tip', callback_data: 'herbal_another_tip' }
        ],
        [
          { text: '🏠 Back to Main Menu', callback_data: 'back_to_main_menu' }
        ]
      ]
    }
  });
  ctx.answerCbQuery('Herbal tip loaded');
});

bot.action('menu_journal', async (ctx) => {
  const { awaitingJournalEntry } = await import('./commandHandlers');
  const userId = ctx.from?.id;
  if (userId) {
    awaitingJournalEntry[userId] = true;
  }
  
  await ctx.editMessageText('📝 Please write your journal entry for today. I am listening...\n\n💡 Tip: Write about your thoughts, feelings, or any insights from your healing journey.\n\n❌ To cancel, type "cancel"', {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '❌ Cancel Journal Entry', callback_data: 'cancel_journal' }
        ],
        [
          { text: '🏠 Back to Main Menu', callback_data: 'back_to_main_menu' }
        ]
      ]
    }
  });
  ctx.answerCbQuery('Journal mode activated');
});

bot.action('menu_health', async (ctx) => {
  const { getAvailableSymptoms } = await import('../services/healthGuidanceService');
  const availableSymptoms = getAvailableSymptoms();
  
  await ctx.editMessageText(`🏥 **Health Guidance System**

I can provide educational information about common symptoms and wellness advice.

📋 **Available Symptoms:**
${availableSymptoms.map(symptom => `• ${symptom.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}`).join('\n')}

💡 **How to use:**
/health [symptom]
Example: /health headache

⚠️ **Important:** This is educational information only and should not replace professional medical advice. Always consult a qualified healthcare provider for proper diagnosis and treatment.`, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🤕 Headache', callback_data: 'health_headache' },
          { text: '😴 Fatigue', callback_data: 'health_fatigue' }
        ],
        [
          { text: '🤢 Digestive Issues', callback_data: 'health_digestive_issues' },
          { text: '😴 Sleep Problems', callback_data: 'health_sleep_problems' }
        ],
        [
          { text: '😰 Stress & Anxiety', callback_data: 'health_stress_anxiety' }
        ],
        [
          { text: '🏠 Back to Main Menu', callback_data: 'back_to_main_menu' }
        ]
      ]
    }
  });
  ctx.answerCbQuery('Health guidance loaded');
});

bot.action('menu_settings', async (ctx) => {
  await ctx.editMessageText('⚙️ **Settings**\n\nSettings feature coming soon!', {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🏠 Back to Main Menu', callback_data: 'back_to_main_menu' }
        ]
      ]
    }
  });
  ctx.answerCbQuery('Settings loaded');
});

// Onboarding: user is ready
bot.action('onboarding_ready', async (ctx) => {
  const chatId = ctx.chat?.id;
  if (!chatId) return;
  await ctx.reply('🕯️ Wonderful! Your healing journey begins now. Here is your main menu:', {
    reply_markup: mainMenuKeyboard
  });
  ctx.answerCbQuery('Let\'s begin!');
});

// Onboarding: learn more
bot.action('onboarding_learn_more', async (ctx) => {
  const chatId = ctx.chat?.id;
  if (!chatId) return;
  await ctx.reply(`
Hikma is a 21-day healing journey inspired by the wisdom of Ibn Sina (Avicenna).

You'll receive daily checklists, wisdom quotes, herbal tips, and gentle reminders to help you purify your body, mind, and spirit.

Ready to begin?`, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🚀 Yes, I\'m Ready!', callback_data: 'onboarding_ready' }
        ]
      ]
    }
  });
  ctx.answerCbQuery('Learn more about Hikma');
});

// Wisdom quote: Teach Me More
bot.action('wisdom_teach_me_more', async (ctx) => {
  const chatId = ctx.chat?.id;
  const messageId = ctx.callbackQuery.message?.message_id;
  if (!chatId || !messageId) return;
  
  const { getRandomWisdomQuote } = await import('../services/wisdomService');
  const quote = await getRandomWisdomQuote();
  
  await ctx.editMessageText(`📜 Wisdom Quote:\n${quote}`, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🔄 Another Quote', callback_data: 'wisdom_teach_me_more' },
          { text: '🌿 Healing Wisdom', callback_data: 'wisdom_healing' }
        ],
        [
          { text: '🧘 Spiritual Wisdom', callback_data: 'wisdom_spiritual' },
          { text: '💭 Philosophy', callback_data: 'wisdom_philosophy' }
        ],
        [
          { text: '🏠 Back to Main Menu', callback_data: 'back_to_main_menu' }
        ]
      ]
    }
  });
  ctx.answerCbQuery('Here is more wisdom!');
});

// Wisdom by category handlers
bot.action('wisdom_healing', async (ctx) => {
  const chatId = ctx.chat?.id;
  const messageId = ctx.callbackQuery.message?.message_id;
  if (!chatId || !messageId) return;
  
  const { getWisdomByCategory } = await import('../services/wisdomService');
  const quote = await getWisdomByCategory('healing');
  
  await ctx.editMessageText(`🌿 Healing Wisdom:\n${quote}`, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🔄 Another Quote', callback_data: 'wisdom_teach_me_more' },
          { text: '🌿 Healing Wisdom', callback_data: 'wisdom_healing' }
        ],
        [
          { text: '🧘 Spiritual Wisdom', callback_data: 'wisdom_spiritual' },
          { text: '💭 Philosophy', callback_data: 'wisdom_philosophy' }
        ],
        [
          { text: '🏠 Back to Main Menu', callback_data: 'back_to_main_menu' }
        ]
      ]
    }
  });
  ctx.answerCbQuery('Healing wisdom for you!');
});

bot.action('wisdom_spiritual', async (ctx) => {
  const chatId = ctx.chat?.id;
  const messageId = ctx.callbackQuery.message?.message_id;
  if (!chatId || !messageId) return;
  
  const { getWisdomByCategory } = await import('../services/wisdomService');
  const quote = await getWisdomByCategory('spiritual');
  
  await ctx.editMessageText(`🧘 Spiritual Wisdom:\n${quote}`, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🔄 Another Quote', callback_data: 'wisdom_teach_me_more' },
          { text: '🌿 Healing Wisdom', callback_data: 'wisdom_healing' }
        ],
        [
          { text: '🧘 Spiritual Wisdom', callback_data: 'wisdom_spiritual' },
          { text: '💭 Philosophy', callback_data: 'wisdom_philosophy' }
        ],
        [
          { text: '🏠 Back to Main Menu', callback_data: 'back_to_main_menu' }
        ]
      ]
    }
  });
  ctx.answerCbQuery('Spiritual wisdom for you!');
});

bot.action('wisdom_philosophy', async (ctx) => {
  const chatId = ctx.chat?.id;
  const messageId = ctx.callbackQuery.message?.message_id;
  if (!chatId || !messageId) return;
  
  const { getWisdomByCategory } = await import('../services/wisdomService');
  const quote = await getWisdomByCategory('philosophy');
  
  await ctx.editMessageText(`💭 Philosophical Wisdom:\n${quote}`, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🔄 Another Quote', callback_data: 'wisdom_teach_me_more' },
          { text: '🌿 Healing Wisdom', callback_data: 'wisdom_healing' }
        ],
        [
          { text: '🧘 Spiritual Wisdom', callback_data: 'wisdom_spiritual' },
          { text: '💭 Philosophy', callback_data: 'wisdom_philosophy' }
        ],
        [
          { text: '🏠 Back to Main Menu', callback_data: 'back_to_main_menu' }
        ]
      ]
    }
  });
  ctx.answerCbQuery('Philosophical wisdom for you!');
});

// Herbal tip: Another tip
bot.action('herbal_another_tip', async (ctx) => {
  const chatId = ctx.chat?.id;
  const messageId = ctx.callbackQuery.message?.message_id;
  if (!chatId || !messageId) return;
  
  const { getRandomHerbalTip } = await import('../services/herbalService');
  const tip = await getRandomHerbalTip();
  
  await ctx.editMessageText(tip, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🌿 Another Herbal Tip', callback_data: 'herbal_another_tip' }
        ],
        [
          { text: '🏠 Back to Main Menu', callback_data: 'back_to_main_menu' }
        ]
      ]
    }
  });
  ctx.answerCbQuery('Here is another herbal wisdom!');
});

// Health guidance callbacks
bot.action('health_headache', async (ctx) => {
  const { getHealthGuidance } = await import('../services/healthGuidanceService');
  const guidance = await getHealthGuidance('headache');
  
  await ctx.editMessageText(guidance, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🏥 Back to Health Menu', callback_data: 'health_menu' }
        ]
      ]
    }
  });
  ctx.answerCbQuery('Headache guidance provided');
});

bot.action('health_fatigue', async (ctx) => {
  const { getHealthGuidance } = await import('../services/healthGuidanceService');
  const guidance = await getHealthGuidance('fatigue');
  
  await ctx.editMessageText(guidance, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🏥 Back to Health Menu', callback_data: 'health_menu' }
        ]
      ]
    }
  });
  ctx.answerCbQuery('Fatigue guidance provided');
});

bot.action('health_digestive_issues', async (ctx) => {
  const { getHealthGuidance } = await import('../services/healthGuidanceService');
  const guidance = await getHealthGuidance('digestive_issues');
  
  await ctx.editMessageText(guidance, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🏥 Back to Health Menu', callback_data: 'health_menu' }
        ]
      ]
    }
  });
  ctx.answerCbQuery('Digestive issues guidance provided');
});

bot.action('health_sleep_problems', async (ctx) => {
  const { getHealthGuidance } = await import('../services/healthGuidanceService');
  const guidance = await getHealthGuidance('sleep_problems');
  
  await ctx.editMessageText(guidance, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🏥 Back to Health Menu', callback_data: 'health_menu' }
        ]
      ]
    }
  });
  ctx.answerCbQuery('Sleep problems guidance provided');
});

bot.action('health_stress_anxiety', async (ctx) => {
  const { getHealthGuidance } = await import('../services/healthGuidanceService');
  const guidance = await getHealthGuidance('stress_anxiety');
  
  await ctx.editMessageText(guidance, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🏥 Back to Health Menu', callback_data: 'health_menu' }
        ]
      ]
    }
  });
  ctx.answerCbQuery('Stress & anxiety guidance provided');
});

bot.action('health_menu', async (ctx) => {
  const { getAvailableSymptoms } = await import('../services/healthGuidanceService');
  const availableSymptoms = getAvailableSymptoms();
  
  await ctx.editMessageText(`🏥 **Health Guidance System**

I can provide educational information about common symptoms and wellness advice.

📋 **Available Symptoms:**
${availableSymptoms.map(symptom => `• ${symptom.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}`).join('\n')}

💡 **How to use:**
/health [symptom]
Example: /health headache

⚠️ **Important:** This is educational information only and should not replace professional medical advice. Always consult a qualified healthcare provider for proper diagnosis and treatment.`, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🤕 Headache', callback_data: 'health_headache' },
          { text: '😴 Fatigue', callback_data: 'health_fatigue' }
        ],
        [
          { text: '🤢 Digestive Issues', callback_data: 'health_digestive_issues' },
          { text: '😴 Sleep Problems', callback_data: 'health_sleep_problems' }
        ],
        [
          { text: '😰 Stress & Anxiety', callback_data: 'health_stress_anxiety' }
        ],
        [
          { text: '🏠 Back to Main Menu', callback_data: 'back_to_main_menu' }
        ]
      ]
    }
  });
  ctx.answerCbQuery('Health menu loaded');
});

// Cancel journal entry
bot.action('cancel_journal', async (ctx) => {
  const userId = ctx.from?.id;
  if (!userId) return;
  
  // Clear the awaiting journal state
  const { awaitingJournalEntry } = await import('./commandHandlers');
  awaitingJournalEntry[userId] = false;
  
  await ctx.editMessageText('Journal entry cancelled. Here is your main menu:', {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "📋 Today's Checklist", callback_data: 'menu_checklist' },
          { text: '📜 Wisdom Quote', callback_data: 'menu_wisdom' }
        ],
        [
          { text: '🌿 Herbal Tips', callback_data: 'menu_herbal' },
          { text: '📝 Journal', callback_data: 'menu_journal' }
        ],
        [
          { text: '🏥 Health Guidance', callback_data: 'menu_health' },
          { text: '⚙️ Settings', callback_data: 'menu_settings' }
        ]
      ]
    }
  });
  ctx.answerCbQuery('Journal cancelled');
});

// Generic checklist toggle handler
async function handleChecklistToggle(ctx: any, item: string) {
  const chatId = ctx.chat?.id;
  const messageId = ctx.callbackQuery.message?.message_id;
  const telegramUser = ctx.from;

  if (!chatId || !messageId) {
    ctx.answerCbQuery('Invalid action.');
    return;
  }

  try {
    const user = await findOrCreateUser(telegramUser);
    const checklist = await getOrCreateTodayChecklist(user);
    const currentValue = checklist[item as keyof typeof checklist] as boolean;
    const updatedChecklist = await updateChecklistItem(checklist.id, item as any, !currentValue);
    
    const progressBar = '▓'.repeat(Math.round(updatedChecklist.completion_percentage / 20)) + '░'.repeat(5 - Math.round(updatedChecklist.completion_percentage / 20));
    const checklistMsg = `
🕯️ Day ${user.current_day} - "Purify the Liver"
السلام عليكم! Time for your healing checklist

Morning Rituals:
💧 Warm Water (500ml) [${updatedChecklist.warm_water ? '✅' : '❌'}]
🌿 Black Seed + Garlic [${updatedChecklist.black_seed_garlic ? '✅' : '❌'}]
🥗 Light Food Before 8pm [${updatedChecklist.light_food_before_8pm ? '✅' : '❌'}]
😴 Sleep by 10pm [${updatedChecklist.sleep_time ? '✅' : '❌'}]
🧘 5-min Thought Clearing [${updatedChecklist.thought_clearing ? '✅' : '❌'}]

Progress: ${progressBar} ${updatedChecklist.completion_percentage}% Complete
`;
    await ctx.editMessageText(checklistMsg, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: `💧 Warm Water ${updatedChecklist.warm_water ? '✅' : '❌'}`, callback_data: `toggle_warm_water_${updatedChecklist.id}` },
            { text: `🌿 Black Seed + Garlic ${updatedChecklist.black_seed_garlic ? '✅' : '❌'}`, callback_data: `toggle_black_seed_garlic_${updatedChecklist.id}` }
          ],
          [
            { text: `🥗 Light Food Before 8pm ${updatedChecklist.light_food_before_8pm ? '✅' : '❌'}`, callback_data: `toggle_light_food_before_8pm_${updatedChecklist.id}` },
            { text: `😴 Sleep by 10pm ${updatedChecklist.sleep_time ? '✅' : '❌'}`, callback_data: `toggle_sleep_time_${updatedChecklist.id}` }
          ],
          [
            { text: `🧘 Thought Clearing ${updatedChecklist.thought_clearing ? '✅' : '❌'}`, callback_data: `toggle_thought_clearing_${updatedChecklist.id}` }
          ],
          [
            { text: '🏠 Back to Main Menu', callback_data: 'back_to_main_menu' }
          ]
        ]
      }
    });
    ctx.answerCbQuery('Checklist updated!');
    
    // If checklist is complete, send a celebratory message
    if (updatedChecklist.completion_percentage === 100) {
      await ctx.reply('🎉 Congratulations! You completed today\'s healing rituals! 🔥\nKeep up the great work on your journey.');
    }
  } catch (error) {
    console.error('❌ Error updating checklist:', error);
    ctx.answerCbQuery('Error updating checklist.');
  }
}

// Individual checklist toggle actions
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