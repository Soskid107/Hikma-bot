"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bot = void 0;
const telegraf_1 = require("telegraf");
const token = process.env.TELEGRAM_BOT_TOKEN;
const webhookUrl = process.env.WEBHOOK_URL;
exports.bot = new telegraf_1.Telegraf(token);
// Set webhook for production
if (webhookUrl) {
    exports.bot.telegram.setWebhook(webhookUrl);
    console.log('✅ Webhook set to:', webhookUrl);
}
else {
    console.log('⚠️ No webhook URL provided, using polling mode');
}
