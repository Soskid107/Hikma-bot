import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';

const token = process.env.TELEGRAM_BOT_TOKEN || '8173997536:AAH58Wfg7DV3kewNN4G9dno_GMs6R-yPcag';
const webhookUrl = process.env.WEBHOOK_URL as string;

export const bot = new Telegraf(token);

// Set up bot commands for the menu
bot.telegram.setMyCommands([
  { command: 'start', description: '🚀 Start your healing journey' },
  { command: 'menu', description: '🏠 Open main menu' },
  { command: 'checklist', description: '📋 Today\'s healing checklist' },
  { command: 'wisdom', description: '📜 Get wisdom quotes' },
  { command: 'herbtip', description: '🌿 Herbal healing tips' },
  { command: 'journal', description: '📝 Write in your journal' },
  { command: 'health', description: '🏥 Health guidance' }
]);

// Function to start the bot
export const startBot = async () => {
  // Only set webhook if we have a proper HTTPS URL
  if (webhookUrl && webhookUrl.startsWith('https://')) {
    await bot.telegram.setWebhook(webhookUrl);
    console.log('✅ Webhook set to:', webhookUrl);
  } else {
    console.log('⚠️ No valid HTTPS webhook URL provided, using polling mode');
    // Start polling
    await bot.launch();
    console.log('✅ Bot started in polling mode');
  }
};