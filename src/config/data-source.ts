import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { DailyChecklist } from '../entities/DailyChecklist';
import { JournalEntry } from '../entities/JournalEntry';
import { ProgressTracking } from '../entities/ProgressTracking';
import { ScheduledMessage } from '../entities/ScheduledMessage';
import { UserInteraction } from '../entities/UserInteraction';
import { WisdomQuote } from '../entities/WisdomQuote';
import { HerbalTip } from '../entities/HerbalTip';
// import other entities as you add them

const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.POSTGRES_URL || process.env.STORAGE_URL || process.env.DATABASE_URL, // Use POSTGRES_URL for Vercel Neon integration
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'hikma_user',
  password: process.env.DB_PASSWORD || 'secure_password',
  database: process.env.DB_NAME || 'hikma_db',
  entities: [
    User,
    DailyChecklist,
    JournalEntry,
    ProgressTracking,
    ScheduledMessage,
    UserInteraction,
    WisdomQuote,
    HerbalTip
  ],
  synchronize: process.env.NODE_ENV !== 'production', // Only sync in development
  logging: process.env.NODE_ENV !== 'production',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export default AppDataSource;
