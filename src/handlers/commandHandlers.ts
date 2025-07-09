import { bot } from '../services/botService';
import { getRandomWisdomQuote } from '../services/wisdomService';
import { findOrCreateUser } from '../services/userService';
import { getOrCreateTodayChecklist } from '../services/checklistService';
import { getRandomHerbalTip } from '../services/herbalService';
import { saveJournalEntry } from '../services/journalService';
import { getHealthGuidance, getAvailableSymptoms } from '../services/healthGuidanceService';

export const mainMenuKeyboard = {
  keyboard: [
    [
      { text: "📋 Today's Checklist" },
      { text: '📜 Wisdom Quote' }
    ],
    [
      { text: '🌿 Herbal Tips' },
      { text: '📝 Journal' }
    ],
    [
      { text: '🏥 Health Guidance' },
      { text: '⚙️ Settings' }
    ]
  ],
  resize_keyboard: true,
  one_time_keyboard: false
};

export const awaitingJournalEntry: { [userId: number]: boolean } = {};

const affirmations = [
  '🌅 Every reflection is a step toward healing. Keep going! 🕯️',
  '💡 Your thoughts matter. Journaling is self-care.',
  '🌿 Healing is a journey, not a destination. You are making progress.',
  '🕯️ Ibn Sina: "The knowledge of anything, since all things have causes, is not acquired or complete unless it is known by its causes."',
  '✨ Small steps every day lead to big changes.'
];

// Start command
bot.command('start', async (ctx) => {
  const chatId = ctx.chat.id;
  const telegramUser = ctx.from;
  let firstName = telegramUser?.first_name || 'friend';

  // Register or update the user in the database
  try {
    await findOrCreateUser(telegramUser);
  } catch (error) {
    console.error('❌ Error registering user:', error);
    ctx.reply('Sorry, there was an error registering you. Please try again later.');
    return;
  }

  const welcomeMessage = `
🕯️ Welcome to Hikma - Your Healing Journey Begins!

السلام عليكم وبركاته

I am Hikma, your companion on a 21-day healing journey inspired by the wisdom of Ibn Sina (Avicenna), the greatest physician of the Islamic Golden Age.

Are you ready to begin your transformation, ${firstName}?
  `;

  ctx.reply(welcomeMessage, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🚀 Yes, I\'m Ready!', callback_data: 'onboarding_ready' },
          { text: 'ℹ️ Learn More', callback_data: 'onboarding_learn_more' }
        ]
      ]
    }
  });
});

// Add onboarding_ready callback to show main menu after onboarding
bot.action('onboarding_ready', async (ctx) => {
  // Edit the onboarding message to indicate onboarding is complete
  await ctx.editMessageText('🚀 You are ready! Here is your main menu:', {
    reply_markup: undefined // Remove inline buttons
  });
  // Show the main menu keyboard for easy navigation
  await ctx.reply(' ', {
    reply_markup: mainMenuKeyboard
  });
  // Immediately pop out the main menu as inline buttons for instant selection
  await ctx.reply('Select an option:', {
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
  await ctx.answerCbQuery();
});

// Wisdom command
bot.command('wisdom', async (ctx) => {
  const chatId = ctx.chat.id;
  let quote = await getRandomWisdomQuote();
  if (!quote || quote.includes('Could not fetch')) {
    quote = 'Could not fetch a wisdom quote at this time. Here is one from Ibn Sina:\n"The body is the boat that carries us through life; we must keep it in good repair."';
  }
  ctx.reply(`📜 Wisdom Quote:\n${quote}`, {
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
});

// Checklist command
bot.command('checklist', async (ctx) => {
  const chatId = ctx.chat.id;
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
    ctx.reply(checklistMsg, {
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
  } catch (error) {
    console.error('❌ Error fetching checklist:', error);
    ctx.reply('Sorry, there was an error fetching your checklist. Please try again later.');
  }
});

// Herbal tip command
bot.command('herbtip', async (ctx) => {
  const chatId = ctx.chat.id;
  try {
    const tip = await getRandomHerbalTip();
    ctx.reply(tip, {
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
  } catch (error) {
    console.error('❌ Error fetching herbal tip:', error);
    ctx.reply('Sorry, there was an error fetching a herbal tip. Please try again later.');
  }
});

// Journal command
bot.command('journal', async (ctx) => {
  const chatId = ctx.chat.id;
  const userId = ctx.from?.id;
  if (!userId) return;
  awaitingJournalEntry[userId] = true;
  ctx.reply('📝 Please write your journal entry for today. I am listening...\n\n💡 Tip: Write about your thoughts, feelings, or any insights from your healing journey.\n\n❌ To cancel, type "cancel"', {
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
});

// Health guidance command
bot.command('health', async (ctx) => {
  const args = ctx.message.text?.split(' ').slice(1);
  if (!args || args.length === 0) {
    const availableSymptoms = getAvailableSymptoms();
    ctx.reply(`🏥 **Health Guidance System**

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
    return;
  }
  
  const symptom = args.join(' ');
  const guidance = await getHealthGuidance(symptom);
  ctx.reply(guidance);
});

// Menu command - accessible from the main menu button
bot.command('menu', async (ctx) => {
  await ctx.reply('🏠 **Main Menu**\n\nWelcome! Use the menu button (left of the message box) to navigate. Select a section to begin your healing journey.', {
    reply_markup: mainMenuKeyboard // Use the custom keyboard for main navigation
  });
});

// Menu button handlers
bot.hears("📋 Today's Checklist", async (ctx) => {
  const chatId = ctx.chat.id;
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
    ctx.reply(checklistMsg, {
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
  } catch (error) {
    console.error('❌ Error fetching checklist:', error);
    ctx.reply('Sorry, there was an error fetching your checklist. Please try again later.');
  }
});

bot.hears('📜 Wisdom Quote', async (ctx) => {
  const quote = await getRandomWisdomQuote();
  ctx.reply(`📜 Wisdom Quote:\n${quote}`, {
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
});

bot.hears('🌿 Herbal Tips', async (ctx) => {
  try {
    const tip = await getRandomHerbalTip();
    ctx.reply(tip, {
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
  } catch (error) {
    console.error('❌ Error fetching herbal tip:', error);
    ctx.reply('Sorry, there was an error fetching a herbal tip. Please try again later.');
  }
});

bot.hears('🏥 Health Guidance', async (ctx) => {
  const availableSymptoms = getAvailableSymptoms();
  ctx.reply(`🏥 **Health Guidance System**

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
});

bot.hears('📝 Journal', async (ctx) => {
  const userId = ctx.from?.id;
  if (!userId) return;
  awaitingJournalEntry[userId] = true;
  ctx.reply('📝 Please write your journal entry for today. I am listening...\n\n💡 Tip: Write about your thoughts, feelings, or any insights from your healing journey.\n\n❌ To cancel, type "cancel"', {
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
});

bot.hears('⚙️ Settings', async (ctx) => {
  ctx.reply('⚙️ **Settings**\n\nSettings feature coming soon!', {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🏠 Back to Main Menu', callback_data: 'back_to_main_menu' }
        ]
      ]
    }
  });
});

// Handle text messages (for journal entries)
bot.on('text', async (ctx) => {
  const chatId = ctx.chat.id;
  const userId = ctx.from?.id;
  const text = ctx.message.text?.trim();
  if (!text || !userId) return;

  if (awaitingJournalEntry[userId]) {
    // Check for cancel command
    if (text.toLowerCase() === 'cancel') {
      ctx.reply('Journal entry cancelled. Here is your main menu:', {
        reply_markup: mainMenuKeyboard
      });
      awaitingJournalEntry[userId] = false;
      return;
    }

    // Save the journal entry
    try {
      const user = await findOrCreateUser(ctx.from);
      await saveJournalEntry(user, text);
      ctx.reply('🌅 Your journal entry has been saved. Reflecting is a step toward healing!');
      // Send a random affirmation
      const affirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
      ctx.reply(affirmation);
      
      // Show the main menu again
      ctx.reply('Here is your main menu:', {
        reply_markup: mainMenuKeyboard
      });
    } catch (error) {
      console.error('❌ Error saving journal entry:', error);
      ctx.reply('Sorry, there was an error saving your journal entry. Please try again later.');
      // Show the main menu even if there's an error
      ctx.reply('Here is your main menu:', {
        reply_markup: mainMenuKeyboard
      });
    }
    awaitingJournalEntry[userId] = false;
    return;
  }
});
