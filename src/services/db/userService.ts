
import { User } from '../../entities/User';
import AppDataSource from '../../config/data-source';

export const getAllActiveUsers = async () => {
  const userRepository = AppDataSource.getRepository(User);
  return userRepository.find({ where: { is_active: true } });
};

export const getUserHealingGoals = async (userId: number) => {
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOne({ where: { id: userId } });
  return user ? user.healing_goals : [];
};

export const generate21DayPlan = (healingGoals: string[]) => {
  // This is just a placeholder. You'll need to implement the actual logic for generating a 21-day plan.
  return healingGoals.map(goal => `Plan for ${goal}`);
};
