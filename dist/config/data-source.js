"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const User_1 = require("../entities/User");
const DailyChecklist_1 = require("../entities/DailyChecklist");
const JournalEntry_1 = require("../entities/JournalEntry");
const ProgressTracking_1 = require("../entities/ProgressTracking");
const ScheduledMessage_1 = require("../entities/ScheduledMessage");
const UserInteraction_1 = require("../entities/UserInteraction");
const WisdomQuote_1 = require("../entities/WisdomQuote");
const HerbalTip_1 = require("../entities/HerbalTip");
// import other entities as you add them
const AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || 'hikma_user',
    password: process.env.DB_PASSWORD || 'secure_password',
    database: process.env.DB_NAME || 'hikma_db',
    entities: [
        User_1.User,
        DailyChecklist_1.DailyChecklist,
        JournalEntry_1.JournalEntry,
        ProgressTracking_1.ProgressTracking,
        ScheduledMessage_1.ScheduledMessage,
        UserInteraction_1.UserInteraction,
        WisdomQuote_1.WisdomQuote,
        HerbalTip_1.HerbalTip
    ],
    synchronize: true, // Use migrations in production!
    logging: true,
});
exports.default = AppDataSource;
