
import { DailyChecklist } from '../../entities/DailyChecklist';
import { User } from '../../entities/User';
import AppDataSource from '../../config/data-source';

export const getOrCreateTodayChecklist = async (user: User) => {
  return AppDataSource.transaction(async transactionalEntityManager => {
    const checklistRepository = transactionalEntityManager.getRepository(DailyChecklist);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let checklist = await checklistRepository.findOne({
      where: { user: { id: user.id }, checklist_date: today },
      lock: { mode: 'pessimistic_write' },
    });

    if (!checklist) {
      const count = await checklistRepository.count({ where: { user: { id: user.id } } });
      checklist = new DailyChecklist();
      checklist.user = user;
      checklist.checklist_date = today;
      checklist.day_number = count + 1;
      await checklistRepository.save(checklist);
    }

    return checklist;
  });
};
