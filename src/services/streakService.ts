import AppDataSource from '../config/data-source';
import { User } from '../entities/User';
import { ProgressTracking } from '../entities/ProgressTracking';

// Update user's daily progress and streak
export async function updateDailyProgress(user: User): Promise<{
  streakUpdated: boolean;
  dayIncremented: boolean;
  newStreak: number;
  newDay: number;
  milestone?: string;
}> {
  const userRepo = AppDataSource.getRepository(User);
  const progressRepo = AppDataSource.getRepository(ProgressTracking);
  
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  const lastChecklistDate = user.last_checklist_date || '';
  
  let streakUpdated = false;
  let dayIncremented = false;
  let milestone: string | undefined;
  
  // If this is a new day
  if (lastChecklistDate !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    // Check if user completed yesterday's checklist
    if (lastChecklistDate === yesterdayStr) {
      // Consecutive day - increment streak and day
      user.current_streak = (user.current_streak || 0) + 1;
      user.current_day = Math.min((user.current_day || 1) + 1, 21);
      streakUpdated = true;
      dayIncremented = true;
    } else if (lastChecklistDate && lastChecklistDate !== today) {
      // Missed a day - reset streak but increment day
      user.current_streak = 1;
      user.current_day = Math.min((user.current_day || 1) + 1, 21);
      streakUpdated = true;
      dayIncremented = true;
    } else {
      // First time or same day
      user.current_streak = user.current_streak || 1;
      user.current_day = user.current_day || 1;
    }
    
    user.last_checklist_date = today;
    user.total_days_completed = (user.total_days_completed || 0) + 1;
    
    // Check for milestones
    milestone = checkMilestones(user.current_streak, user.current_day, user.total_days_completed);
  }
  
  // Update progress tracking
  let progress = await progressRepo.findOne({ 
    where: { user: { id: user.id } }, 
    relations: ['user'] 
  });
  
  if (!progress) {
    progress = progressRepo.create({ user });
  }
  
  progress.current_streak = user.current_streak;
  progress.total_days_completed = user.total_days_completed;
  progress.last_active_date = new Date();
  
  if (user.current_streak > progress.longest_streak) {
    progress.longest_streak = user.current_streak;
  }
  
  // Calculate completion rate
  progress.completion_rate = Math.round((user.total_days_completed / 21) * 100);
  
  // Calculate healing score (based on streak, completion rate, and consistency)
  progress.healing_score = Math.round(
    (user.current_streak * 10) + 
    (progress.completion_rate * 0.5) + 
    (user.total_days_completed * 2)
  );
  
  await userRepo.save(user);
  await progressRepo.save(progress);
  
  return {
    streakUpdated,
    dayIncremented,
    newStreak: user.current_streak,
    newDay: user.current_day,
    milestone
  };
}

// Check for milestone achievements
function checkMilestones(streak: number, day: number, totalDays: number): string | undefined {
  const milestones: string[] = [];
  
  // Streak milestones
  if (streak === 3) {
    milestones.push('🔥 3-Day Streak! You\'re building momentum!');
  }
  if (streak === 7) {
    milestones.push('🌟 Week Warrior! You\'ve completed a full week!');
  }
  if (streak === 14) {
    milestones.push('💪 Two-Week Champion! Your dedication is inspiring!');
  }
  if (streak === 21) {
    milestones.push('🏆 Perfect Journey! You\'ve completed the full 21 days!');
  }
  
  // Day milestones
  if (day === 7) {
    milestones.push('📅 Week 1 Complete! You\'re 1/3 of the way there!');
  }
  if (day === 14) {
    milestones.push('📅 Week 2 Complete! You\'re 2/3 of the way there!');
  }
  if (day === 21) {
    milestones.push('🎉 Journey Complete! You\'ve finished your 21-day transformation!');
  }
  
  // Total days milestones
  if (totalDays === 10) {
    milestones.push('📊 10 Days of Healing! You\'re making real progress!');
  }
  if (totalDays === 15) {
    milestones.push('📊 15 Days Strong! Your commitment is paying off!');
  }
  if (totalDays === 20) {
    milestones.push('📊 20 Days of Dedication! Almost there!');
  }
  
  return milestones.length > 0 ? milestones.join('\n') : undefined;
}

// Get user's progress summary with streak information
export function getProgressSummary(user: User, progress: ProgressTracking): string {
  const streakEmoji = user.current_streak >= 7 ? '🔥' : 
                     user.current_streak >= 3 ? '⚡' : '💪';
  
  const progressBar = '▓'.repeat(Math.round((user.current_day / 21) * 10)) + 
                     '░'.repeat(10 - Math.round((user.current_day / 21) * 10));
  
  return `📊 **Your Healing Journey**

${progressBar} Day ${user.current_day}/21

${streakEmoji} **Current Streak:** ${user.current_streak} days
🏅 **Longest Streak:** ${progress.longest_streak} days
✅ **Total Days Completed:** ${progress.total_days_completed}
📈 **Completion Rate:** ${progress.completion_rate}%
💎 **Healing Score:** ${progress.healing_score}

${getStreakMotivation(user.current_streak)}`;
}

// Get motivational message based on streak
export function getStreakMotivation(streak: number): string {
  if (streak >= 21) {
    return '🏆 **Perfect!** You\'ve completed the full journey! Keep maintaining these healthy habits.';
  } else if (streak >= 14) {
    return '💪 **Amazing!** You\'re in the final stretch. Your dedication is inspiring!';
  } else if (streak >= 7) {
    return '🌟 **Excellent!** You\'ve built a solid foundation. Keep going strong!';
  } else if (streak >= 3) {
    return '⚡ **Great start!** You\'re building momentum. Consistency is key!';
  } else if (streak >= 1) {
    return '🌱 **Welcome!** Every journey begins with a single step. You\'ve got this!';
  } else {
    return '🚀 **Ready to begin?** Start your healing journey today!';
  }
}

// Get weekly milestone message
export function getWeeklyMilestoneMessage(week: number): string {
  const milestones = {
    1: {
      title: '🌟 Week 1 Complete!',
      message: 'You\'ve successfully completed your first week of healing! Your body is beginning to adapt to these new healthy habits. Keep up the great work!',
      quote: 'The journey of a thousand miles begins with one step. – Lao Tzu'
    },
    2: {
      title: '💪 Week 2 Complete!',
      message: 'Two weeks strong! You\'re building lasting habits and your body is responding to your care. You\'re more than halfway there!',
      quote: 'Consistency is the key to success. – Unknown'
    },
    3: {
      title: '🏆 Week 3 Complete!',
      message: 'Congratulations! You\'ve completed the full 21-day journey! You\'ve transformed your habits and your life. This is just the beginning of your wellness journey.',
      quote: 'Health is not everything, but without health, everything is nothing. – Arthur Schopenhauer'
    }
  };
  
  const milestone = milestones[week as keyof typeof milestones];
  if (!milestone) return '';
  
  return `**${milestone.title}**

${milestone.message}

*"${milestone.quote}"*

🎉 **Keep going!** Your future self will thank you for this investment in your health and well-being.`;
}

// Check if user should receive a reminder
export function shouldSendReminder(user: User, progress: ProgressTracking): boolean {
  const today = new Date().toISOString().split('T')[0];
  const lastActive = user.last_checklist_date;
  
  // If user hasn't completed today's checklist and it's evening
  if (lastActive !== today) {
    const now = new Date();
    const hour = now.getHours();
    
    // Send reminder in the evening (6-9 PM) if they haven't completed today's checklist
    if (hour >= 18 && hour <= 21) {
      return true;
    }
  }
  
  return false;
}

// Get personalized reminder message
export function getPersonalizedReminder(user: User): string {
  const goalTags = user.goal_tags as any || { general: true };
  const activeGoals = Object.keys(goalTags).filter(goal => goalTags[goal]);
  
  let reminder = `🌙 **Evening Reminder**
  
Don't forget to complete today's healing rituals!`;
  
  if (activeGoals.includes('sleep')) {
    reminder += '\n\n😴 **Sleep Focus:** Remember to prepare for restful sleep tonight.';
  }
  
  if (activeGoals.includes('stress')) {
    reminder += '\n\n🧘 **Stress Relief:** Take a moment to breathe and center yourself.';
  }
  
  if (activeGoals.includes('digestion')) {
    reminder += '\n\n🥗 **Digestion:** Light meal before 8pm helps your body rest better.';
  }
  
  reminder += `\n\n📋 Complete your daily checklist to maintain your ${user.current_streak || 0}-day streak!`;
  
  return reminder;
}

// Reset user's progress (for admin use or user request)
export async function resetUserProgress(user: User): Promise<void> {
  const userRepo = AppDataSource.getRepository(User);
  const progressRepo = AppDataSource.getRepository(ProgressTracking);
  
  user.current_day = 1;
  user.current_streak = 0;
  user.total_days_completed = 0;
  user.last_checklist_date = '';
  
  await userRepo.save(user);
  
  // Reset progress tracking
  const progress = await progressRepo.findOne({ 
    where: { user: { id: user.id } }, 
    relations: ['user'] 
  });
  
  if (progress) {
    progress.current_streak = 0;
    progress.total_days_completed = 0;
    progress.completion_rate = 0;
    progress.healing_score = 0;
    await progressRepo.save(progress);
  }
} 