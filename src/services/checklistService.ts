// Database service for personalized checklist management
import AppDataSource from '../config/data-source';
import { DailyChecklist } from '../entities/DailyChecklist';
import { User } from '../entities/User';
import { getDailyContent } from './contentEngine';

// Create or get today's checklist with personalized content
export async function getOrCreateTodayChecklist(user: User): Promise<DailyChecklist> {
  const checklistRepo = AppDataSource.getRepository(DailyChecklist);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let checklist = await checklistRepo.findOne({
    where: { user: { id: user.id }, checklist_date: today },
    relations: ['user'],
  });

  if (!checklist) {
    // Get personalized content for this user
    const dailyContent = getDailyContent(user, user.current_day || 1);
    
    // Create personalized checklist items
    const checklistItems = dailyContent.checklist.map((item, index) => ({
      id: `item_${index}`,
      text: item,
      completed: false,
      order: index
    }));
    
    checklist = checklistRepo.create({
      user,
      day_number: user.current_day || 1,
      checklist_date: today,
      checklist_items: checklistItems,
      daily_focus: dailyContent.focus,
      daily_tip: dailyContent.tip,
      daily_quote: dailyContent.quote,
      completion_percentage: 0,
    });
    
    await checklistRepo.save(checklist);
  }
  
  return checklist;
}

// Update a specific checklist item
export async function updateChecklistItem(checklistId: number, itemId: string, completed: boolean): Promise<DailyChecklist> {
  const checklistRepo = AppDataSource.getRepository(DailyChecklist);
  const checklist = await checklistRepo.findOneBy({ id: checklistId });
  
  if (!checklist) {
    throw new Error('Checklist not found');
  }
  
  // Update the specific item
  const updatedItems = checklist.checklist_items.map(item => 
    item.id === itemId ? { ...item, completed } : item
  );
  
  // Calculate completion percentage
  const completedCount = updatedItems.filter(item => item.completed).length;
  const completionPercentage = Math.round((completedCount / updatedItems.length) * 100);
  
  checklist.checklist_items = updatedItems;
  checklist.completion_percentage = completionPercentage;
  
  if (completionPercentage === 100 && !checklist.completed_at) {
    checklist.completed_at = new Date();
  }
  
  return await checklistRepo.save(checklist);
}

// Get personalized checklist content based on user goals
export function getPersonalizedChecklistContent(user: User): { checklist: string[], tip: string, focus: string } {
  const dailyContent = getDailyContent(user, user.current_day || 1);
  
  return {
    checklist: dailyContent.checklist,
    tip: dailyContent.tip,
    focus: dailyContent.focus
  };
}

// Get a random healing checklist item/tip (fallback for backward compatibility)
export function getRandomChecklistTip(): string {
  const tips = [
    '💧 Drink 500ml of warm water first thing in the morning to kickstart your metabolism.',
    '🌿 Take your black seed and garlic for natural healing support.',
    '🥗 Eat a light meal before 8pm to aid digestion and restful sleep.',
    '😴 Aim to sleep by 10pm for optimal liver detox and healing.',
    '🧘 Spend 5 minutes clearing your thoughts and practicing mindfulness.'
  ];
  return tips[Math.floor(Math.random() * tips.length)];
} 