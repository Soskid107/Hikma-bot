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
  synchronize: true, // Use migrations in production!
  logging: true,
});

export default AppDataSource;
