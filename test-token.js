require('dotenv/config');
const { Telegraf } = require('telegraf');

// Try to get token from environment, fallback to direct value
const token = process.env.TELEGRAM_BOT_TOKEN || '8173997536:AAH58Wfg7DV3kewNN4G9dno_GMs6R-yPcag';

console.log('Testing bot token...');
console.log('Token:', token ? token.substring(0, 10) + '...' : 'NOT FOUND');

if (!token) {
  console.error('❌ No bot token found');
  process.exit(1);
}

const bot = new Telegraf(token);

bot.telegram.getMe()
  .then((botInfo) => {
    console.log('✅ Bot token is valid!');
    console.log('Bot name:', botInfo.first_name);
    console.log('Bot username:', botInfo.username);
    console.log('Bot ID:', botInfo.id);
  })
  .catch((error) => {
    console.error('❌ Bot token is invalid:', error.message);
    console.log('Please check:');
    console.log('1. Did you create the bot with @BotFather?');
    console.log('2. Is the token correct?');
    console.log('3. Has the bot been activated?');
  })
  .finally(() => {
    process.exit(0);
  }); 