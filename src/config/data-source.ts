import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { DailyChecklist } from '../entities/DailyChecklist';
import { JournalEntry } from '../entities/JournalEntry';
import { ProgressTracking } from '../entities/ProgressTracking';
import { ScheduledMessage } from '../entities/ScheduledMessage';
import { UserInteraction } from '../entities/UserInteraction';
import { WisdomQuote } from '../entities/WisdomQuote';
import { HerbalTip } from '../entities/HerbalTip';

// Debug: Check if DATABASE_URL is loaded
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');

const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
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
  synchronize: true, // Temporarily enable to sync schema
  logging: false,
  migrations: [__dirname + '/../migrations/*.ts'],
});

export default AppDataSource;
