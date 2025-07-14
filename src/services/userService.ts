// Database service disabled for local/mock-only operation
import AppDataSource from '../config/data-source';
import { User } from '../entities/User';
import { ProgressTracking } from '../entities/ProgressTracking';

// Define a type for healing goals
interface HealingGoals {
  goals: string;
}

export async function findOrCreateUser(telegramUser: any): Promise<User> {
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

// Get all active users
export async function getAllActiveUsers(): Promise<User[]> {
  const userRepo = AppDataSource.getRepository(User);
  return userRepo.find({ where: { is_active: true } });
}

// Update notification settings for a user
export async function updateNotificationSettings(userId: number, settings: Record<string, unknown>): Promise<User | null> {
  const userRepo = AppDataSource.getRepository(User);
  const user = await userRepo.findOne({ where: { id: userId } });
  if (!user) return null;
  user.notification_settings = settings;
  await userRepo.save(user);
  return user;
}

// Get a user's healing goals
export async function getUserHealingGoals(userId: number): Promise<HealingGoals | null> {
  const userRepo = AppDataSource.getRepository(User);
  const user = await userRepo.findOne({ where: { id: userId } });
  const healingGoals = user?.healing_goals as any;
  if (!user || !healingGoals || typeof healingGoals.goals !== 'string') return null;
  return { goals: healingGoals.goals };
}

// Goal-based plan templates
const PLAN_TEMPLATES: { [goal: string]: string[] } = {
  digestion: [
    '🥗 Eat a light meal before 8pm and practice gratitude.',
    '🍵 Try a herbal tea for digestion today.',
    '🚶 Take a gentle walk after meals.',
    '📝 Keep a food diary for the day.',
    '🥒 Add a probiotic food to your meal.'
  ],
  stress: [
    '🧘 Practice deep breathing to reduce stress.',
    '🌳 Spend 10 minutes in nature or fresh air.',
    '📖 Write down 3 things you are grateful for.',
    '🎵 Listen to calming music for 10 minutes.',
    '🛀 Take a relaxing bath or shower.'
  ],
  sleep: [
    '😴 Avoid screens 1 hour before bed for better sleep.',
    '🛏️ Make your bedroom dark and cool tonight.',
    '📖 Read a calming book before bed.',
    '🧘 Try a short meditation before sleep.',
    '🍵 Drink a non-caffeinated herbal tea in the evening.'
  ],
  energy: [
    '☀️ Get some sunlight and stretch in the morning.',
    '🚶 Take a brisk walk for 10 minutes.',
    '💧 Drink an extra glass of water today.',
    '🍎 Eat a fresh fruit as a snack.',
    '📝 Plan tomorrow’s morning routine.'
  ],
  spiritual: [
    '🙏 Spend a few minutes in spiritual reflection or prayer.',
    '📿 Read or listen to a spiritual teaching.',
    '🕯️ Light a candle and set an intention for the day.',
    '📝 Journal about your spiritual journey.',
    '🤲 Practice an act of kindness.'
  ],
  immunity: [
    '🌿 Take black seed and garlic for natural support.',
    '🍋 Add lemon to your water for vitamin C.',
    '🧄 Add a clove of garlic to your meal.',
    '🧴 Wash your hands regularly today.',
    '🥦 Eat a serving of green vegetables.'
  ],
  general: [
    '💧 Drink 500ml of warm water and reflect on your intention for healing.',
    '🧘 Spend 5 minutes in thought clearing or meditation.',
    '📖 Write a short journal entry about your progress.',
    '🚶 Take a gentle walk and focus on your breath.',
    '🌟 Celebrate a small win from today.'
  ]
};

// Improved plan generator
export function generate21DayPlan(healingGoals: HealingGoals | null): string[] {
  const goalsText = healingGoals && healingGoals.goals ? healingGoals.goals.toLowerCase() : '';
  const selectedGoals: string[] = [];
  for (const goal of Object.keys(PLAN_TEMPLATES)) {
    if (goalsText.includes(goal)) selectedGoals.push(goal);
  }
  if (selectedGoals.length === 0) selectedGoals.push('general');
  // Blend plan items from all selected templates
  const plan: string[] = [];
  let i = 0;
  while (plan.length < 21) {
    for (const goal of selectedGoals) {
      const template = PLAN_TEMPLATES[goal];
      if (template && template[i % template.length]) {
        plan.push(template[i % template.length]);
        if (plan.length === 21) break;
      }
    }
    i++;
  }
  return plan;
}

// Get or create progress tracking for a user
export async function getOrCreateProgressTracking(user: User): Promise<ProgressTracking> {
  const repo = AppDataSource.getRepository(ProgressTracking);
  let progress = await repo.findOne({ where: { user: { id: user.id } }, relations: ['user'] });
  if (!progress) {
    progress = repo.create({ user });
    await repo.save(progress);
  }
  return progress;
}

// Update streak after completion
export async function updateUserStreak(user: User): Promise<ProgressTracking> {
  const repo = AppDataSource.getRepository(ProgressTracking);
  let progress = await getOrCreateProgressTracking(user);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const lastActive = progress.last_active_date ? new Date(progress.last_active_date) : null;
  if (!lastActive || (today.getTime() - lastActive.getTime()) > 24 * 60 * 60 * 1000) {
    // Missed a day or first entry
    progress.current_streak = 1;
  } else if ((today.getTime() - lastActive.getTime()) === 24 * 60 * 60 * 1000) {
    // Consecutive day
    progress.current_streak += 1;
  }
  progress.last_active_date = today;
  progress.total_days_completed += 1;
  if (progress.current_streak > progress.longest_streak) {
    progress.longest_streak = progress.current_streak;
  }
  await repo.save(progress);
  return progress;
}

// Update user language preference
export async function updateUserLanguage(userId: number, lang: string): Promise<User | null> {
  const userRepo = AppDataSource.getRepository(User);
  const user = await userRepo.findOne({ where: { id: userId } });
  if (!user) return null;
  user.language_preference = lang;
  await userRepo.save(user);
  return user;
} 