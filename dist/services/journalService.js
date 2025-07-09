"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveJournalEntry = saveJournalEntry;
exports.getTodayJournalEntry = getTodayJournalEntry;
const data_source_1 = __importDefault(require("../config/data-source"));
const JournalEntry_1 = require("../entities/JournalEntry");
async function saveJournalEntry(user, entryText) {
    const repo = data_source_1.default.getRepository(JournalEntry_1.JournalEntry);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let entry = await repo.findOne({ where: { user: { id: user.id }, entry_date: today }, relations: ['user'] });
    if (!entry) {
        entry = repo.create({ user, entry_date: today, entry_text: entryText });
    }
    else {
        entry.entry_text = entryText;
    }
    await repo.save(entry);
    return entry;
}
async function getTodayJournalEntry(user) {
    const repo = data_source_1.default.getRepository(JournalEntry_1.JournalEntry);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return repo.findOne({ where: { user: { id: user.id }, entry_date: today }, relations: ['user'] });
}
