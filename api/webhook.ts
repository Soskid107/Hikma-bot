import { IncomingMessage, ServerResponse } from 'http';
import 'dotenv/config';
import { bot } from '../src/services/botService';

// TypeScript declaration for global variable
declare global {
  var handlersLoaded: boolean;
  var dbInitialized: boolean;
}

// Validate environment variables
function validateEnvironment(): boolean {
  const requiredVars = ['TELEGRAM_BOT_TOKEN'];
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing);
    return false;
  }
  
  console.log('✅ Environment variables validated');
  return true;
}

// Mock database initialization (no database needed)
async function initializeDatabase(): Promise<boolean> {
  if (!global.dbInitialized) {
    console.log('✅ Using mock database (no external database needed)');
    global.dbInitialized = true;
  }
  return true;
}

// Helper function to parse request body
function parseBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  try {
    // Validate environment variables first
    if (!validateEnvironment()) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ 
        error: 'Configuration error',
        message: 'Missing required environment variables'
      }));
      return;
    }

    // Initialize database
    const dbInitialized = await initializeDatabase();
    if (!dbInitialized) {
      console.warn('⚠️ Database not available, continuing without database');
    }

    // Load handlers (only once per cold start)
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

    // Parse request body
    const body = await parseBody(req);
    
    // Handle Telegram webhook
    await bot.handleUpdate(body, res);
    
  } catch (error: any) {
    console.error('❌ Webhook error:', error);
    
    // Send proper error response only if headers haven't been sent
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error?.message || 'Unknown error' : 'Something went wrong'
      }));
    }
  }
  // Note: We don't close the database connection in serverless environment
  // Vercel will handle the connection lifecycle
} 