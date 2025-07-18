"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
require("dotenv/config");
const botService_1 = require("../src/services/botService");
function validateEnvironment() {
    const requiredVars = ['TELEGRAM_BOT_TOKEN'];
    const missing = requiredVars.filter(varName => !process.env[varName]);
    if (missing.length > 0) {
        console.error('❌ Missing required environment variables:', missing);
        return false;
    }
    console.log('✅ Environment variables validated');
    return true;
}
async function initializeDatabase() {
    if (!global.dbInitialized) {
        console.log('✅ Using mock database (no external database needed)');
        global.dbInitialized = true;
    }
    return true;
}
function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                resolve(JSON.parse(body));
            }
            catch (error) {
                reject(error);
            }
        });
        req.on('error', reject);
    });
}
async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        res.statusCode = 200;
        res.end();
        return;
    }
    if (req.method !== 'POST') {
        res.statusCode = 405;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Method not allowed' }));
        return;
    }
    try {
        if (!validateEnvironment()) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
                error: 'Configuration error',
                message: 'Missing required environment variables'
            }));
            return;
        }
        const dbInitialized = await initializeDatabase();
        if (!dbInitialized) {
            console.warn('⚠️ Database not available, continuing without database');
        }
        if (!global.handlersLoaded) {
            require('../src/handlers/commandHandlers');
            require('../src/handlers/callbackHandlers');
            require('../src/handlers/onboardingHandlers');
            require('../src/handlers/journalHandlers');
            require('../src/handlers/settingsHandlers');
            require('../src/handlers/wisdomHandlers');
            require('../src/handlers/herbalHandlers');
            require('../src/handlers/healthHandlers');
            require('../src/handlers/healingPlanHandlers');
            require('../src/handlers/checklistHandlers');
            require('../src/handlers/healingTipHandlers');
            global.handlersLoaded = true;
            console.log('✅ All handlers loaded');
        }
        const body = await parseBody(req);
        await botService_1.bot.handleUpdate(body, res);
    }
    catch (error) {
        console.error('❌ Webhook error:', error);
        if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
                error: 'Internal server error',
                message: process.env.NODE_ENV === 'development' ? error?.message || 'Unknown error' : 'Something went wrong'
            }));
        }
    }
}
//# sourceMappingURL=webhook.js.map