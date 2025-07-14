// Mock user service for testing without database
export interface MockUser {
  id: number;
  telegram_id: number;
  first_name: string;
  username?: string;
  healing_goals?: any;
  current_day?: number;
  notification_settings?: any;
  language_preference?: string;
  last_name?: string;
  registration_date?: Date;
  timezone?: string;
  healing_path?: string;
  is_active?: boolean;
  last_interaction?: Date;
  created_at?: Date;
  updated_at?: Date;
}

const mockUsers = new Map<number, MockUser>();

export const findOrCreateUser = async (telegramUser: any): Promise<MockUser> => {
  const telegramId = telegramUser.id;
  
  if (mockUsers.has(telegramId)) {
    return mockUsers.get(telegramId)!;
  }
  
  const newUser: MockUser = {
    id: Date.now(),
    telegram_id: telegramId,
    first_name: telegramUser.first_name || 'User',
    username: telegramUser.username,
    healing_goals: {},
    current_day: 1,
    notification_settings: {}
  };
  
  mockUsers.set(telegramId, newUser);
  return newUser;
};

export const getUserHealingGoals = async (userId: number) => {
  const user = Array.from(mockUsers.values()).find(u => u.id === userId);
  return user?.healing_goals || {};
};

export const generate21DayPlan = (goals: any) => {
  return [
    "Day 1: Begin with intention setting and morning hydration",
    "Day 2: Focus on mindful eating and herbal teas",
    "Day 3: Practice gratitude and evening reflection"
  ];
};

export const updateUserStreak = async (userId: number) => {
  const user = Array.from(mockUsers.values()).find(u => u.id === userId);
  if (user) {
    user.current_day = (user.current_day || 1) + 1;
  }
};

export const getOrCreateProgressTracking = async (userId: number) => {
  return {
    id: userId,
    current_streak: 1,
    total_days: 1,
    total_days_completed: 1,
    longest_streak: 1,
    completion_rate: 100,
    healing_score: 85
  };
};

export const getAllActiveUsers = async () => {
  return Array.from(mockUsers.values());
};

export const updateNotificationSettings = async (userId: number, settings: object) => {
  const user = Array.from(mockUsers.values()).find(u => u.id === userId);
  if (user) {
    user.notification_settings = settings;
  }
  return user;
};

export const updateUserLanguage = async (userId: number, language: string) => {
  const user = Array.from(mockUsers.values()).find(u => u.id === userId);
  if (user) {
    user.language_preference = language;
  }
  return user;
}; 