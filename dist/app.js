"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const data_source_1 = __importDefault(require("./config/data-source"));
const express_1 = __importDefault(require("express"));
const botService_1 = require("./services/botService");
const PORT = 3000;
const WEBHOOK_PATH = '/telegram-webhook';
data_source_1.default.initialize()
    .then(() => {
    console.log('✅ Data Source has been initialized!');
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    // Load handlers before setting up webhook
    require('./handlers/commandHandlers');
    require('./handlers/callbackHandlers');
    // Set up Telegraf webhook
    app.use(botService_1.bot.webhookCallback(WEBHOOK_PATH));
    app.listen(PORT, () => {
        console.log(`🚀 Express server listening on port ${PORT}`);
        console.log(`📡 Webhook endpoint: http://localhost:${PORT}${WEBHOOK_PATH}`);
    });
})
    .catch((err) => {
    console.error('❌ Error during Data Source initialization', err);
    process.exit(1);
});
