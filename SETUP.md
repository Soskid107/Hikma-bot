# Hikma Bot Setup Guide

## Debugging Issues

### 1. TypeScript Compilation Fixed ✅
The TypeScript compilation error with `HerbalTip` entity has been resolved by adding the proper import.

### 2. Environment Variables Required ⚠️
The bot requires a Telegram Bot Token to run. You need to:

1. Create a `.env` file in the root directory with:
```
TELEGRAM_BOT_TOKEN=your_actual_bot_token_here
WEBHOOK_URL=https://your-domain.com/telegram-webhook  # Optional for production
ADMIN_USER_IDS=123456789,987654321  # Optional
NODE_ENV=development
```

2. Get a bot token from [@BotFather](https://t.me/botfather) on Telegram

### 3. Running the Bot

#### Development Mode (Polling)
```bash
npm run dev
```

#### Production Mode (Webhook)
```bash
npm start
```

### 4. Current Status
- ✅ TypeScript compilation working
- ✅ Mock services configured (no database needed)
- ✅ All handlers loaded
- ❌ Missing bot token (causes 401 error)

### 5. Features Available
- 🌿 Herbal healing tips
- 📋 Daily checklists
- 📜 Wisdom quotes
- 📝 Journal entries
- 🏥 Health guidance
- 🧘 Healing plans

### 6. Next Steps
1. Get a bot token from @BotFather
2. Create `.env` file with your token
3. Run `npm run dev`
4. Test the bot on Telegram

The bot will work in polling mode for development and webhook mode for production. 