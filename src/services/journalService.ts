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

// List all journal entries for a user, paginated
export async function listJournalEntries(user: User, page: number = 1, pageSize: number = 5): Promise<{ entries: JournalEntry[]; total: number; }> {
  const repo = AppDataSource.getRepository(JournalEntry);
  const [entries, total] = await repo.findAndCount({
    where: { user: { id: user.id } },
    order: { entry_date: 'DESC' },
    skip: (page - 1) * pageSize,
    take: pageSize,
    relations: ['user']
  });
  return { entries, total };
}

// Get a specific journal entry by ID
export async function getJournalEntryById(user: User, entryId: number): Promise<JournalEntry | null> {
  const repo = AppDataSource.getRepository(JournalEntry);
  return repo.findOne({ where: { id: entryId, user: { id: user.id } }, relations: ['user'] });
}

// Update a journal entry by ID
export async function updateJournalEntryById(user: User, entryId: number, entryText: string): Promise<JournalEntry | null> {
  const repo = AppDataSource.getRepository(JournalEntry);
  const entry = await repo.findOne({ where: { id: entryId, user: { id: user.id } }, relations: ['user'] });
  if (!entry) return null;
  entry.entry_text = entryText;
  await repo.save(entry);
  return entry;
}

// Delete a journal entry by ID
export async function deleteJournalEntryById(user: User, entryId: number): Promise<boolean> {
  const repo = AppDataSource.getRepository(JournalEntry);
  const entry = await repo.findOne({ where: { id: entryId, user: { id: user.id } } });
  if (!entry) return false;
  await repo.remove(entry);
  return true;
}

export async function countJournalEntries(user: User): Promise<number> {
  const repo = AppDataSource.getRepository(JournalEntry);
  return repo.count({ where: { user: { id: user.id } } });
} 