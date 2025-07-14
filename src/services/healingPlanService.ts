// Database service disabled for local/mock-only operation
// import AppDataSource from '../config/data-source';
// import { User } from '../entities/User';
// import { DailyChecklist } from '../entities/DailyChecklist';
// import cron from 'node-cron';

// Healing plan structure for different goals
interface HealingPlanDay {
  day: number;
  focus: string;
  checklist_items: {
    warm_water: string;
    black_seed_garlic: string;
    light_food_before_8pm: string;
    sleep_time: string;
    thought_clearing: string;
  };
  daily_tip: string;
  healing_wisdom: string;
}

interface HealingPlan {
  goal: string;
  description: string;
  days: HealingPlanDay[];
}

// Curated 21-day healing plans based on common healing goals
const HEALING_PLANS: HealingPlan[] = [
  {
    goal: 'liver_detox',
    description: 'Purify and strengthen the liver for optimal health',
    days: [
      {
        day: 1,
        focus: 'Liver Awakening',
        checklist_items: {
          warm_water: 'Drink 500ml warm water with lemon to stimulate liver function',
          black_seed_garlic: 'Take black seed oil and garlic for liver support',
          light_food_before_8pm: 'Eat light, liver-friendly foods before sunset',
          sleep_time: 'Sleep by 10pm to allow liver detox during night hours',
          thought_clearing: '5-minute meditation focusing on liver health'
        },
        daily_tip: 'Your liver works hardest between 1-3 AM. Early sleep supports natural detox.',
        healing_wisdom: 'The liver is the body\'s master chemist. Treat it with respect and it will serve you well.'
      },
      {
        day: 2,
        focus: 'Digestive Harmony',
        checklist_items: {
          warm_water: 'Warm water with ginger to enhance digestion',
          black_seed_garlic: 'Black seed and garlic for gut health',
          light_food_before_8pm: 'Avoid heavy, fried foods',
          sleep_time: 'Sleep by 10pm for digestive rest',
          thought_clearing: 'Meditation on digestive wellness'
        },
        daily_tip: 'Chew your food slowly and mindfully. Digestion begins in the mouth.',
        healing_wisdom: 'A healthy gut is the foundation of overall wellness.'
      },
      {
        day: 3,
        focus: 'Energy Restoration',
        checklist_items: {
          warm_water: 'Warm water with honey for natural energy',
          black_seed_garlic: 'Black seed and garlic for vitality',
          light_food_before_8pm: 'Eat energizing foods like dates and nuts',
          sleep_time: 'Sleep by 10pm for energy restoration',
          thought_clearing: 'Visualization of energy flowing through your body'
        },
        daily_tip: 'Natural energy comes from proper rest, nutrition, and positive thoughts.',
        healing_wisdom: 'Your energy is a precious resource. Use it wisely and replenish it daily.'
      }
      // ... Add more days as needed
    ]
  },
  {
    goal: 'stress_relief',
    description: 'Reduce stress and find inner peace through natural healing',
    days: [
      {
        day: 1,
        focus: 'Mindful Awareness',
        checklist_items: {
          warm_water: 'Sip warm water slowly, focusing on each breath',
          black_seed_garlic: 'Black seed and garlic for nervous system support',
          light_food_before_8pm: 'Eat calming foods like chamomile tea',
          sleep_time: 'Sleep by 10pm for stress hormone regulation',
          thought_clearing: '10-minute mindfulness meditation'
        },
        daily_tip: 'Stress is not in the events, but in your response to them.',
        healing_wisdom: 'Peace comes from within. Do not seek it without.'
      }
      // ... Add more days
    ]
  },
  {
    goal: 'immune_boost',
    description: 'Strengthen your immune system naturally',
    days: [
      {
        day: 1,
        focus: 'Immune Foundation',
        checklist_items: {
          warm_water: 'Warm water with turmeric for immune support',
          black_seed_garlic: 'Black seed and garlic for natural immunity',
          light_food_before_8pm: 'Eat immune-boosting foods like citrus',
          sleep_time: 'Sleep by 10pm for immune system repair',
          thought_clearing: 'Meditation on health and vitality'
        },
        daily_tip: 'Your immune system is your body\'s defense army. Nourish it well.',
        healing_wisdom: 'Health is not everything, but without health, everything is nothing.'
      }
      // ... Add more days
    ]
  }
];

// Function to get healing plan for a specific goal
export function getHealingPlan(goal: string): HealingPlan | null {
  return HEALING_PLANS.find(plan => plan.goal === goal) || null;
}

// Function to get specific day plan
export function getDayPlan(goal: string, day: number): HealingPlanDay | null {
  const plan = getHealingPlan(goal);
  if (!plan) return null;
  return plan.days.find(d => d.day === day) || null;
}

// Function to get daily tip based on user's goal and current day
export function getDailyTip(user: any): string {
  const userGoal = (user.healing_goals as any)?.goal || 'liver_detox';
  const dayPlan = getDayPlan(userGoal, user.current_day);
  
  if (dayPlan) {
    return dayPlan.daily_tip;
  }
  
  // Fallback tips
  const fallbackTips = [
    'Your body has an incredible ability to heal. Trust the process.',
    'Small daily actions compound into remarkable results.',
    'Healing is not a destination, but a journey of self-discovery.',
    'Every cell in your body is working for your wellness.',
    'Patience and consistency are the keys to lasting health.'
  ];
  
  return fallbackTips[Math.floor(Math.random() * fallbackTips.length)];
}

// Function to get healing wisdom for the day
export function getHealingWisdom(user: any): string {
  const userGoal = (user.healing_goals as any)?.goal || 'liver_detox';
  const dayPlan = getDayPlan(userGoal, user.current_day);
  
  if (dayPlan) {
    return dayPlan.healing_wisdom;
  }
  
  // Fallback wisdom
  const fallbackWisdom = [
    'Health is the greatest gift, contentment the greatest wealth, faithfulness the best relationship.',
    'The doctor of the future will give no medicine, but will instruct his patient in the care of the human frame.',
    'Let food be thy medicine and medicine be thy food.',
    'The natural healing force within each of us is the greatest force in getting well.',
    'Healing is a matter of time, but it is sometimes also a matter of opportunity.'
  ];
  
  return fallbackWisdom[Math.floor(Math.random() * fallbackWisdom.length)];
}

// Function to get customized checklist items for the day
export function getCustomizedChecklistItems(user: any): any {
  const userGoal = (user.healing_goals as any)?.goal || 'liver_detox';
  const dayPlan = getDayPlan(userGoal, user.current_day);
  
  if (dayPlan) {
    return {
      warm_water: dayPlan.checklist_items.warm_water,
      black_seed_garlic: dayPlan.checklist_items.black_seed_garlic,
      light_food_before_8pm: dayPlan.checklist_items.light_food_before_8pm,
      sleep_time: dayPlan.checklist_items.sleep_time,
      thought_clearing: dayPlan.checklist_items.thought_clearing
    };
  }
  
  // Default checklist items
  return {
    warm_water: 'Drink 500ml warm water to start your day',
    black_seed_garlic: 'Take black seed oil and garlic for health support',
    light_food_before_8pm: 'Eat a light meal before 8pm',
    sleep_time: 'Sleep by 10pm for optimal rest',
    thought_clearing: '5-minute thought clearing meditation'
  };
}

// Function to increment user's day and reset checklist
export async function incrementUserDay(userId: number): Promise<void> {
  // const userRepo = AppDataSource.getRepository(User);
  // const checklistRepo = AppDataSource.getRepository(DailyChecklist);
  
  // const user = await userRepo.findOneBy({ id: userId });
  // if (!user) return;
  
  // Increment current day (max 21 days)
  // if (user.current_day < 21) {
  //   user.current_day += 1;
  //   await userRepo.save(user);
    
  //   // Clear today's checklist to start fresh
  //   const today = new Date();
  //   today.setHours(0, 0, 0, 0);
    
  //   await checklistRepo.delete({
  //     user: { id: userId },
  //     checklist_date: today
  //   });
    
  //   console.log(`✅ Day incremented for user ${userId} to day ${user.current_day}`);
  // } else {
  //   console.log(`🎉 User ${userId} completed the 21-day journey!`);
  // }
  console.log(`🎉 User ${userId} completed the 21-day journey!`);
}

// Function to get all users and increment their days at midnight
export async function incrementAllUsersDays(): Promise<void> {
  // const userRepo = AppDataSource.getRepository(User);
  // const users = await userRepo.find({ where: { is_active: true } });
  
  // for (const user of users) {
  //   try {
  //     await incrementUserDay(user.id);
  //   } catch (error) {
  //     console.error(`❌ Error incrementing day for user ${user.id}:`, error);
  //   }
  // }
  console.log('🎉 All users completed the 21-day journey!');
}

// Function to get user's progress summary
export function getUserProgressSummary(user: any): string {
  const userGoal = (user.healing_goals as any)?.goal || 'liver_detox';
  const plan = getHealingPlan(userGoal);
  
  if (!plan) {
    return `Day ${user.current_day} of 21 - Continue your healing journey`;
  }
  
  const dayPlan = getDayPlan(userGoal, user.current_day);
  const focus = dayPlan ? dayPlan.focus : 'Healing Journey';
  
  return `Day ${user.current_day} of 21 - ${focus}\n${plan.description}`;
}

// Initialize the midnight cron job for day progression
export function initializeDayProgression(): void {
  // Run at midnight every day
  // cron.schedule('0 0 * * *', async () => {
  //   console.log('🕛 Midnight reached - incrementing all users\' days...');
  //   try {
  //     await incrementAllUsersDays();
  //     console.log('✅ Day progression completed successfully');
  //   } catch (error) {
  //     console.error('❌ Error during day progression:', error);
  //   }
  // });
  
  console.log('⏰ Day progression cron job initialized (runs at midnight) - DISABLED');
} 