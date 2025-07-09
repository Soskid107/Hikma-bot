import AppDataSource from '../config/data-source';
import { User } from '../entities/User';

export async function findOrCreateUser(telegramUser: any) {
  const userRepo = AppDataSource.getRepository(User);
  let user = await userRepo.findOne({ where: { telegram_id: telegramUser.id } });
  if (!user) {
    user = userRepo.create({
      telegram_id: telegramUser.id,
      username: telegramUser.username,
      first_name: telegramUser.first_name,
      last_name: telegramUser.last_name,
      language_preference: telegramUser.language_code || 'en',
      last_interaction: new Date(),
    });
    await userRepo.save(user);
  } else {
    user.username = telegramUser.username;
    user.first_name = telegramUser.first_name;
    user.last_name = telegramUser.last_name;
    user.language_preference = telegramUser.language_code || user.language_preference;
    user.last_interaction = new Date();
    await userRepo.save(user);
  }
  return user;
} 