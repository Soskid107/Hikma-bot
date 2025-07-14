import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { DailyChecklist } from '../entities/DailyChecklist';
import { JournalEntry } from '../entities/JournalEntry';
import { ProgressTracking } from '../entities/ProgressTracking';
import { ScheduledMessage } from '../entities/ScheduledMessage';
import { UserInteraction } from '../entities/UserInteraction';
import { WisdomQuote } from '../entities/WisdomQuote';
import { HerbalTip } from '../entities/HerbalTip';

const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
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
  synchronize: false, // Use migrations!
  logging: false,
  migrations: [__dirname + '/../migrations/*.ts'],
});

export default AppDataSource;
