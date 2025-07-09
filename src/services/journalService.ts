import AppDataSource from '../config/data-source';
import { JournalEntry } from '../entities/JournalEntry';
import { User } from '../entities/User';

export async function saveJournalEntry(user: User, entryText: string): Promise<JournalEntry> {
  const repo = AppDataSource.getRepository(JournalEntry);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let entry = await repo.findOne({ where: { user: { id: user.id }, entry_date: today }, relations: ['user'] });
  if (!entry) {
    entry = repo.create({ user, entry_date: today, entry_text: entryText });
  } else {
    entry.entry_text = entryText;
  }
  await repo.save(entry);
  return entry;
}

export async function getTodayJournalEntry(user: User): Promise<JournalEntry | null> {
  const repo = AppDataSource.getRepository(JournalEntry);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return repo.findOne({ where: { user: { id: user.id }, entry_date: today }, relations: ['user'] });
} 