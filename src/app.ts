import 'dotenv/config';
import AppDataSource from './config/data-source';
import express from 'express';
import { bot } from './services/botService';

const PORT = 3000;
const WEBHOOK_PATH = '/telegram-webhook';
const webhookUrl = process.env.WEBHOOK_URL as string;

AppDataSource.initialize()
  .then(() => {
    console.log('✅ Data Source has been initialized!');
    const app = express();
    app.use(express.json());

    // Load handlers
    require('./handlers/commandHandlers');
    require('./handlers/callbackHandlers');

    // Only set up webhook if we have a proper HTTPS URL
    if (webhookUrl && webhookUrl.startsWith('https://')) {
      // Set up Telegraf webhook
      app.use(bot.webhookCallback(WEBHOOK_PATH));
      console.log(`📡 Webhook endpoint: http://localhost:${PORT}${WEBHOOK_PATH}`);
    }

    app.listen(PORT, () => {
      console.log(`🚀 Express server listening on port ${PORT}`);
      if (!webhookUrl || !webhookUrl.startsWith('https://')) {
        console.log('🤖 Bot running in polling mode - no webhook setup needed');
      }
    });
  })
  .catch((err) => {
    console.error('❌ Error during Data Source initialization', err);
    process.exit(1);
  });