"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainMenuKeyboard = void 0;
const botService_1 = require("../services/botService");
const wisdomService_1 = require("../services/wisdomService");
const userService_1 = require("../services/userService");
const checklistService_1 = require("../services/checklistService");
const herbalService_1 = require("../services/herbalService");
const journalService_1 = require("../services/journalService");
exports.mainMenuKeyboard = {
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
            { text: '⚙️ Settings' }
        ]
    ],
    resize_keyboard: true,
    one_time_keyboard: false
};
const awaitingJournalEntry = {};
const affirmations = [
    '🌅 Every reflection is a step toward healing. Keep going! 🕯️',
    '💡 Your thoughts matter. Journaling is self-care.',
    '🌿 Healing is a journey, not a destination. You are making progress.',
    '🕯️ Ibn Sina: "The knowledge of anything, since all things have causes, is not acquired or complete unless it is known by its causes."',
    '✨ Small steps every day lead to big changes.'
];
// Start command
botService_1.bot.command('start', async (ctx) => {
    const chatId = ctx.chat.id;
    const telegramUser = ctx.from;
    let firstName = telegramUser?.first_name || 'friend';
    // Register or update the user in the database
    try {
        await (0, userService_1.findOrCreateUser)(telegramUser);
    }
    catch (error) {
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
// Wisdom command
botService_1.bot.command('wisdom', async (ctx) => {
    const chatId = ctx.chat.id;
    let quote = await (0, wisdomService_1.getRandomWisdomQuote)();
    if (!quote || quote.includes('Could not fetch')) {
        quote = 'Could not fetch a wisdom quote at this time. Here is one from Ibn Sina:\n"The body is the boat that carries us through life; we must keep it in good repair."';
    }
    ctx.reply(`📜 Wisdom Quote:\n${quote}`, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Teach Me More', callback_data: 'wisdom_teach_me_more' }
                ]
            ]
        }
    });
});
// Checklist command
botService_1.bot.command('checklist', async (ctx) => {
    const chatId = ctx.chat.id;
    const telegramUser = ctx.from;
    try {
        const user = await (0, userService_1.findOrCreateUser)(telegramUser);
        const checklist = await (0, checklistService_1.getOrCreateTodayChecklist)(user);
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
                    ]
                ]
            }
        });
    }
    catch (error) {
        console.error('❌ Error fetching checklist:', error);
        ctx.reply('Sorry, there was an error fetching your checklist. Please try again later.');
    }
});
// Herbal tip command
botService_1.bot.command('herbtip', async (ctx) => {
    const chatId = ctx.chat.id;
    try {
        const tip = await (0, herbalService_1.getRandomHerbalTip)();
        ctx.reply(tip);
    }
    catch (error) {
        console.error('❌ Error fetching herbal tip:', error);
        ctx.reply('Sorry, there was an error fetching a herbal tip. Please try again later.');
    }
});
// Journal command
botService_1.bot.command('journal', async (ctx) => {
    const chatId = ctx.chat.id;
    const userId = ctx.from?.id;
    if (!userId)
        return;
    awaitingJournalEntry[userId] = true;
    ctx.reply('📝 Please write your journal entry for today. I am listening...');
});
// Menu button handlers
botService_1.bot.hears("📋 Today's Checklist", async (ctx) => {
    const chatId = ctx.chat.id;
    const telegramUser = ctx.from;
    try {
        const user = await (0, userService_1.findOrCreateUser)(telegramUser);
        const checklist = await (0, checklistService_1.getOrCreateTodayChecklist)(user);
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
                    ]
                ]
            }
        });
    }
    catch (error) {
        console.error('❌ Error fetching checklist:', error);
        ctx.reply('Sorry, there was an error fetching your checklist. Please try again later.');
    }
});
botService_1.bot.hears('📜 Wisdom Quote', async (ctx) => {
    const quote = await (0, wisdomService_1.getRandomWisdomQuote)();
    ctx.reply(`📜 Wisdom Quote:\n${quote}`, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Teach Me More', callback_data: 'wisdom_teach_me_more' }
                ]
            ]
        }
    });
});
botService_1.bot.hears('🌿 Herbal Tips', async (ctx) => {
    try {
        const tip = await (0, herbalService_1.getRandomHerbalTip)();
        ctx.reply(tip);
    }
    catch (error) {
        console.error('❌ Error fetching herbal tip:', error);
        ctx.reply('Sorry, there was an error fetching a herbal tip. Please try again later.');
    }
});
botService_1.bot.hears('📝 Journal', async (ctx) => {
    const userId = ctx.from?.id;
    if (!userId)
        return;
    awaitingJournalEntry[userId] = true;
    ctx.reply('📝 Please write your journal entry for today. I am listening...');
});
botService_1.bot.hears('⚙️ Settings', async (ctx) => {
    ctx.reply('⚙️ Settings feature coming soon!');
});
// Handle text messages (for journal entries)
botService_1.bot.on('text', async (ctx) => {
    const chatId = ctx.chat.id;
    const userId = ctx.from?.id;
    const text = ctx.message.text?.trim();
    if (!text || !userId)
        return;
    if (awaitingJournalEntry[userId]) {
        // Save the journal entry
        try {
            const user = await (0, userService_1.findOrCreateUser)(ctx.from);
            await (0, journalService_1.saveJournalEntry)(user, text);
            ctx.reply('🌅 Your journal entry has been saved. Reflecting is a step toward healing!');
            // Send a random affirmation
            const affirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
            ctx.reply(affirmation);
        }
        catch (error) {
            console.error('❌ Error saving journal entry:', error);
            ctx.reply('Sorry, there was an error saving your journal entry. Please try again later.');
        }
        awaitingJournalEntry[userId] = false;
        return;
    }
});
