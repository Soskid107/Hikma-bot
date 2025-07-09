import AppDataSource from '../config/data-source';
import { DailyChecklist } from '../entities/DailyChecklist';
import { User } from '../entities/User';

export async function getOrCreateTodayChecklist(user: User) {
  const checklistRepo = AppDataSource.getRepository(DailyChecklist);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let checklist = await checklistRepo.findOne({
    where: { user: { id: user.id }, checklist_date: today },
    relations: ['user'],
  });

  if (!checklist) {
    checklist = checklistRepo.create({
      user,
      day_number: user.current_day,
      checklist_date: today,
      warm_water: false,
      black_seed_garlic: false,
      light_food_before_8pm: false,
      sleep_time: false,
      thought_clearing: false,
      completion_percentage: 0,
    });
    await checklistRepo.save(checklist);
  }
  return checklist;
}

export async function updateChecklistItem(checklistId: number, item: keyof DailyChecklist, value: boolean) {
  const checklistRepo = AppDataSource.getRepository(DailyChecklist);
  const checklist = await checklistRepo.findOneBy({ id: checklistId });
  if (!checklist) throw new Error('Checklist not found');
  (checklist[item] as boolean) = value;
  // Recalculate completion percentage
  const items = [
    checklist.warm_water,
    checklist.black_seed_garlic,
    checklist.light_food_before_8pm,
    checklist.sleep_time,
    checklist.thought_clearing,
  ];
  checklist.completion_percentage = Math.round((items.filter(Boolean).length / items.length) * 100);
  await checklistRepo.save(checklist);
  return checklist;
} 