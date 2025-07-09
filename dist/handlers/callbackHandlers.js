"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const botService_1 = require("../services/botService");
const userService_1 = require("../services/userService");
const checklistService_1 = require("../services/checklistService");
const commandHandlers_1 = require("./commandHandlers");
// Onboarding: user is ready
botService_1.bot.action('onboarding_ready', async (ctx) => {
    const chatId = ctx.chat?.id;
    if (!chatId)
        return;
    await ctx.reply('🕯️ Wonderful! Your healing journey begins now. Here is your main menu:', {
        reply_markup: commandHandlers_1.mainMenuKeyboard
    });
    ctx.answerCbQuery('Let\'s begin!');
});
// Onboarding: learn more
botService_1.bot.action('onboarding_learn_more', async (ctx) => {
    const chatId = ctx.chat?.id;
    if (!chatId)
        return;
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
botService_1.bot.action('wisdom_teach_me_more', async (ctx) => {
    const chatId = ctx.chat?.id;
    const messageId = ctx.callbackQuery.message?.message_id;
    if (!chatId || !messageId)
        return;
    const { getRandomWisdomQuote } = await Promise.resolve().then(() => __importStar(require('../services/wisdomService')));
    const quote = await getRandomWisdomQuote();
    await ctx.editMessageText(`📜 Wisdom Quote:\n${quote}`, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Teach Me More', callback_data: 'wisdom_teach_me_more' }
                ]
            ]
        }
    });
    ctx.answerCbQuery('Here is more wisdom!');
});
// Generic checklist toggle handler
async function handleChecklistToggle(ctx, item) {
    const chatId = ctx.chat?.id;
    const messageId = ctx.callbackQuery.message?.message_id;
    const telegramUser = ctx.from;
    if (!chatId || !messageId) {
        ctx.answerCbQuery('Invalid action.');
        return;
    }
    try {
        const user = await (0, userService_1.findOrCreateUser)(telegramUser);
        const checklist = await (0, checklistService_1.getOrCreateTodayChecklist)(user);
        const currentValue = checklist[item];
        const updatedChecklist = await (0, checklistService_1.updateChecklistItem)(checklist.id, item, !currentValue);
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
                    ]
                ]
            }
        });
        ctx.answerCbQuery('Checklist updated!');
        // If checklist is complete, send a celebratory message
        if (updatedChecklist.completion_percentage === 100) {
            await ctx.reply('🎉 Congratulations! You completed today\'s healing rituals! 🔥\nKeep up the great work on your journey.');
        }
    }
    catch (error) {
        console.error('❌ Error updating checklist:', error);
        ctx.answerCbQuery('Error updating checklist.');
    }
}
// Individual checklist toggle actions
botService_1.bot.action(/^toggle_warm_water_\d+$/, async (ctx) => {
    await handleChecklistToggle(ctx, 'warm_water');
});
botService_1.bot.action(/^toggle_black_seed_garlic_\d+$/, async (ctx) => {
    await handleChecklistToggle(ctx, 'black_seed_garlic');
});
botService_1.bot.action(/^toggle_light_food_before_8pm_\d+$/, async (ctx) => {
    await handleChecklistToggle(ctx, 'light_food_before_8pm');
});
botService_1.bot.action(/^toggle_sleep_time_\d+$/, async (ctx) => {
    await handleChecklistToggle(ctx, 'sleep_time');
});
botService_1.bot.action(/^toggle_thought_clearing_\d+$/, async (ctx) => {
    await handleChecklistToggle(ctx, 'thought_clearing');
});
