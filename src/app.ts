import 'reflect-metadata';
import 'dotenv/config';
import express from 'express';
import { bot, startBot } from './services/botService';
import cron from 'node-cron';
import AppDataSource from './config/data-source';
import { User } from './entities/User';
import { getAllActiveUsers, getUserHealingGoals, generate21DayPlan } from './services/userService';
import { getOrCreateTodayChecklist } from './services/db/checklistService';
import { getRandomHealingTip } from './services/db/healingTipService';
import { Request, Response, NextFunction } from 'express';


import { NotificationSettings } from './types/NotificationSettings';

import { handleError } from './utils/errorHandler';

// Global error logging
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});

const DEFAULT_REMINDER_TIME = '08:00';
const DEFAULT_TIP_INTERVAL = 'daily';

// Helper to parse time string (HH:MM) to cron format
function timeToCron(time: string = DEFAULT_REMINDER_TIME) {
  const [hour, minute] = time.split(':').map(Number);
  return `${minute} ${hour} * * *`;
}

// Helper to parse interval string to cron format (supports daily, every X days, weekly)
function intervalToCron(interval: string = DEFAULT_TIP_INTERVAL) {
  if (interval === 'daily') return '0 8 * * *';
  if (interval === 'weekly') return '0 8 * * 1';
  const match = interval.match(/every (\d+) days?/i);
  if (match) {
    const days = parseInt(match[1], 10);
    return `0 8 */${days} * *`;
  }
  // fallback: daily
  return '0 8 * * *';
}

// Use Railway's assigned port if available, otherwise default to 8080
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;
const WEBHOOK_PATH = '/telegram-webhook';
const webhookUrl = process.env.WEBHOOK_URL as string;

  

const app = express();
app.use(express.json());

// Health check endpoint for Railway
app.get('/health', (req, res) => {
  res.send('OK');
});

function main() {
  AppDataSource.initialize()
    .then(() => {
      // Load handlers
      require('./handlers/commandHandlers');
      require('./handlers/callbackHandlers');
      require('./handlers/journalHandlers');
      require('./handlers/settingsHandlers');
      require('./handlers/onboardingHandlers');
      require('./handlers/wisdomHandlers');
      require('./handlers/herbalHandlers');
      require('./handlers/healthHandlers');
      require('./handlers/healingPlanHandlers');
      require('./handlers/checklistHandlers');
      require('./handlers/healingTipHandlers');

      if (webhookUrl && webhookUrl.startsWith('https://')) {
        app.use(WEBHOOK_PATH, (req, res, next) => {
          console.log('Received webhook request:', req.method, req.url, req.body);
          next();
        });
        app.use(WEBHOOK_PATH, bot.webhookCallback(WEBHOOK_PATH));
        console.log(`📡 Webhook endpoint: http://localhost:${PORT}${WEBHOOK_PATH}`);
      }

      cron.schedule('0 * * * *', async () => {
        try {
          const users = await getAllActiveUsers();
          const now = new Date();
          const currentHour = now.getHours();
          const currentMinute = now.getMinutes();

          for (const user of users) {
            const settings: NotificationSettings = user.notification_settings || {};
            const [reminderHour, reminderMinute] = (settings.reminder_time || DEFAULT_REMINDER_TIME).split(':').map(Number);

            if (reminderHour === currentHour && reminderMinute === currentMinute) {
              // Send checklist reminder
              try {
                const checklist = await getOrCreateTodayChecklist(user);
                const progressBar = '▓'.repeat(Math.round(checklist.completion_percentage / 20)) + '░'.repeat(5 - Math.round(checklist.completion_percentage / 20));
                const checklistMsg = `🕯️ Day ${user.current_day} - "Purify the Liver"
Your healing checklist for today:

Morning Rituals:
💧 Warm Water (500ml) [${checklist.warm_water ? '✅' : '❌'}]
🌿 Black Seed + Garlic [${checklist.black_seed_garlic ? '✅' : '❌'}]
🥗 Light Food Before 8pm [${checklist.light_food_before_8pm ? '✅' : '❌'}]
😴 Sleep by 10pm [${checklist.sleep_time ? '✅' : '❌'}]
🧘 5-min Thought Clearing [${checklist.thought_clearing ? '✅' : '❌'}]

Progress: ${progressBar} ${checklist.completion_percentage}% Complete`;
                const healingGoals = await getUserHealingGoals(user.id);
                const plan = generate21DayPlan(healingGoals);
                const dayIndex = Math.max(0, Math.min(plan.length - 1, (user.current_day || 1) - 1));
                const planTip = plan[dayIndex];
                await bot.telegram.sendMessage(user.telegram_id, `${checklistMsg}\n\n🌱 *Today's Healing Focus:*\n${planTip}`, { parse_mode: 'Markdown' });
              } catch (err) {
                handleError(err);
              }
            }

            // Send healing tip
            const tipInterval = settings.tip_interval || DEFAULT_TIP_INTERVAL;
            if (tipInterval === 'daily' && currentHour === 8 && currentMinute === 0) {
              try {
                const tipObj = await getRandomHealingTip();
                const tip = tipObj ? tipObj.tip_text : 'No healing tips available.';
                await bot.telegram.sendMessage(user.telegram_id, `💡 Healing Tip:\n${tip}`);
              } catch (err) {
                handleError(err);
              }
            }
          }
        } catch (err) {
          handleError(err);
        }
      });

      app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 Express server listening on port ${PORT}`);
        startBot().catch(error => {
          console.error('❌ Error starting bot:', error);
        });
      });
    })
    .catch(err => {
      console.error("❌ Error during Data Source initialization", err);
      process.exit(1);
    });
}

main();

// Add global error handler after all routes
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  handleError(err, res);
});