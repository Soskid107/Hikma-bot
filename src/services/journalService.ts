import AppDataSource from '../config/data-source';
import { JournalEntry } from '../entities/JournalEntry';
import { User } from '../entities/User';
import { MoreThanOrEqual } from 'typeorm';

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

// Update a journal entry
export async function updateJournalEntry(user: User, entryId: number, updates: Partial<JournalEntry>): Promise<JournalEntry | null> {
  const repo = AppDataSource.getRepository(JournalEntry);
  const entry = await repo.findOne({ where: { id: entryId, user: { id: user.id } }, relations: ['user'] });
  if (!entry) return null;
  Object.assign(entry, updates);
  return await repo.save(entry);
}

// Delete a journal entry
export async function deleteJournalEntry(user: User, entryId: number): Promise<boolean> {
  const repo = AppDataSource.getRepository(JournalEntry);
  const entry = await repo.findOne({ where: { id: entryId, user: { id: user.id } } });
  if (!entry) return false;
  await repo.remove(entry);
  return true;
}

// Get journal statistics for a user
export async function getJournalStats(user: User): Promise<{
  total_entries: number;
  this_month: number;
  this_week: number;
  average_mood: number;
  average_energy: number;
  average_sleep: number;
}> {
  const repo = AppDataSource.getRepository(JournalEntry);
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));

  const [total, thisMonth, thisWeek] = await Promise.all([
    repo.count({ where: { user: { id: user.id } } }),
    repo.count({ where: { user: { id: user.id }, entry_date: MoreThanOrEqual(startOfMonth) } }),
    repo.count({ where: { user: { id: user.id }, entry_date: MoreThanOrEqual(startOfWeek) } })
  ]);

  // Calculate averages (simplified)
  const entries = await repo.find({ where: { user: { id: user.id } } });
  const avgMood = entries.reduce((sum, entry) => sum + (entry.mood_rating || 0), 0) / entries.length || 0;
  const avgEnergy = entries.reduce((sum, entry) => sum + (entry.energy_level || 0), 0) / entries.length || 0;
  const avgSleep = entries.reduce((sum, entry) => sum + (entry.sleep_quality || 0), 0) / entries.length || 0;

  return {
    total_entries: total,
    this_month: thisMonth,
    this_week: thisWeek,
    average_mood: avgMood,
    average_energy: avgEnergy,
    average_sleep: avgSleep
  };
}

export async function countJournalEntries(user: User): Promise<number> {
  const repo = AppDataSource.getRepository(JournalEntry);
  return repo.count({ where: { user: { id: user.id } } });
} 