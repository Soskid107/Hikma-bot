
import { DailyChecklist } from '../../entities/DailyChecklist';
import { User } from '../../entities/User';
import AppDataSource from '../../config/data-source';

export const getOrCreateTodayChecklist = async (user: User) => {
  const checklistRepository = AppDataSource.getRepository(DailyChecklist);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let checklist = await checklistRepository.findOne({ where: { user: { id: user.id }, checklist_date: today } });

  if (!checklist) {
    checklist = new DailyChecklist();
    checklist.user = user;
    checklist.checklist_date = today;
    await checklistRepository.save(checklist);
  }

  return checklist;
};
