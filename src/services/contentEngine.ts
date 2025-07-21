import { User } from '../entities/User';
import { loadKnowledge } from './localKnowledgeService';

// Goal categories that can be extracted from user input
export interface GoalTags {
  sleep?: boolean;
  stress?: boolean;
  digestion?: boolean;
  energy?: boolean;
  spiritual?: boolean;
  immunity?: boolean;
  anxiety?: boolean;
  hormonal?: boolean;
  general?: boolean;
}

// Daily content structure
export interface DailyContent {
  checklist: string[];
  tip: string;
  quote: string;
  journalPrompt: string;
  focus: string;
}

// Content mappings for each goal category
const GOAL_CONTENT_MAPPINGS = {
  sleep: {
    checklist: [
      '😴 Sleep before 10pm for optimal rest',
      '🛏️ Make your bedroom dark and cool',
      '📖 Read a calming book before bed',
      '🧘 Try a short meditation before sleep',
      '🍵 Drink chamomile tea in the evening'
    ],
    tips: [
      'Chamomile relaxes the nervous system. Try before bed.',
      'Your body repairs during deep sleep. Early bedtime is key.',
      'Avoid screens 1 hour before bed for better sleep quality.',
      'A cool, dark room promotes deeper sleep cycles.',
      'Consistent sleep schedule regulates your circadian rhythm.'
    ],
    quotes: [
      'When the soul is at peace, the body follows. – Ibn Sina',
      'Sleep is the best meditation. – Dalai Lama',
      'The best bridge between despair and hope is a good night\'s sleep. – E. Joseph Cossman',
      'Sleep is the golden chain that ties health and our bodies together. – Thomas Dekker',
      'A good laugh and a long sleep are the best cures in the doctor\'s book. – Irish Proverb'
    ],
    journalPrompts: [
      'What robs you of rest at night?',
      'How do you feel when you wake up well-rested?',
      'What evening routine helps you prepare for sleep?',
      'Describe your ideal sleep environment.',
      'What thoughts keep you awake at night?'
    ]
  },
  stress: {
    checklist: [
      '🧘 Practice deep breathing for 5 minutes',
      '🌳 Spend 10 minutes in nature or fresh air',
      '📖 Write down 3 things you are grateful for',
      '🎵 Listen to calming music for 10 minutes',
      '🛀 Take a relaxing bath or shower'
    ],
    tips: [
      'Stress is not in the events, but in your response to them.',
      'Deep breathing activates your parasympathetic nervous system.',
      'Nature has a calming effect on the mind and body.',
      'Gratitude shifts focus from problems to blessings.',
      'Regular stress management prevents chronic health issues.'
    ],
    quotes: [
      'Peace comes from within. Do not seek it without. – Buddha',
      'Stress is the trash of modern life. We all generate it, but if you don\'t dispose of it properly, it will pile up and overtake your life. – Danzae Pace',
      'The greatest glory in living lies not in never falling, but in rising every time we fall. – Nelson Mandela',
      'When you change the way you look at things, the things you look at change. – Wayne Dyer',
      'Happiness is not something ready-made. It comes from your own actions. – Dalai Lama'
    ],
    journalPrompts: [
      'What makes you feel centered when chaos surrounds you?',
      'How do you typically respond to stressful situations?',
      'What activities help you feel most relaxed?',
      'Describe a time when you overcame a difficult challenge.',
      'What would your ideal stress-free day look like?'
    ]
  },
  digestion: {
    checklist: [
      '🥗 Eat a light meal before 8pm',
      '🍵 Try a herbal tea for digestion',
      '🚶 Take a gentle walk after meals',
      '📝 Keep a food diary for the day',
      '🥒 Add a probiotic food to your meal'
    ],
    tips: [
      'Black seed improves gut-brain axis and digestion.',
      'Chew your food slowly and mindfully. Digestion begins in the mouth.',
      'A healthy gut is the foundation of overall wellness.',
      'Ginger tea can soothe digestive discomfort.',
      'Probiotics support healthy gut bacteria balance.'
    ],
    quotes: [
      'Let food be thy medicine and medicine be thy food. – Hippocrates',
      'A healthy gut is a happy gut. – Unknown',
      'The stomach is the center of health. – Traditional Wisdom',
      'Good digestion is the foundation of good health. – Unknown',
      'Your gut is your second brain. Treat it well. – Unknown'
    ],
    journalPrompts: [
      'How do different foods make you feel?',
      'What eating habits support your digestion?',
      'Describe your relationship with food.',
      'What foods give you energy vs. drain you?',
      'How does your mood affect your digestion?'
    ]
  },
  energy: {
    checklist: [
      '☀️ Get some sunlight and stretch in the morning',
      '🚶 Take a brisk walk for 10 minutes',
      '💧 Drink an extra glass of water today',
      '🍎 Eat a fresh fruit as a snack',
      '📝 Plan tomorrow\'s morning routine'
    ],
    tips: [
      'Natural energy comes from proper rest, nutrition, and positive thoughts.',
      'Your energy is a precious resource. Use it wisely and replenish it daily.',
      'Morning sunlight regulates your circadian rhythm.',
      'Hydration is essential for cellular energy production.',
      'Movement increases blood flow and oxygen to your cells.'
    ],
    quotes: [
      'Energy and persistence conquer all things. – Benjamin Franklin',
      'The energy of the mind is the essence of life. – Aristotle',
      'Your energy introduces you before you even speak. – Unknown',
      'Positive energy attracts positive results. – Unknown',
      'The only way to do great work is to love what you do. – Steve Jobs'
    ],
    journalPrompts: [
      'What activities give you the most energy?',
      'How do you want to feel throughout the day?',
      'What drains your energy and how can you minimize it?',
      'Describe your ideal energy level for different times of day.',
      'What morning routine would set you up for success?'
    ]
  },
  spiritual: {
    checklist: [
      '🙏 Spend a few minutes in spiritual reflection or prayer',
      '📿 Read or listen to a spiritual teaching',
      '🕯️ Light a candle and set an intention for the day',
      '📝 Journal about your spiritual journey',
      '🤲 Practice an act of kindness'
    ],
    tips: [
      'Spiritual practice connects you to something greater than yourself.',
      'Daily reflection deepens your understanding of life\'s purpose.',
      'Gratitude opens the heart to receive more blessings.',
      'Acts of kindness create positive energy that returns to you.',
      'Meditation quiets the mind and opens the soul.'
    ],
    quotes: [
      'The soul always knows what to do to heal itself. The challenge is to silence the mind. – Caroline Myss',
      'Spirituality is not about religion. It\'s about connecting with your soul. – Unknown',
      'Your soul knows the way. Run in that direction. – Rumi',
      'The spiritual journey is individual, highly personal. It can\'t be organized or regulated. – Carlos Castaneda',
      'Peace comes from within. Do not seek it without. – Buddha'
    ],
    journalPrompts: [
      'What does spirituality mean to you?',
      'How do you connect with your higher self?',
      'What spiritual practices resonate with you?',
      'Describe a moment when you felt deeply connected to something greater.',
      'What would your ideal spiritual practice look like?'
    ]
  },
  immunity: {
    checklist: [
      '🌿 Take black seed and garlic for natural support',
      '🍋 Add lemon to your water for vitamin C',
      '🧄 Add a clove of garlic to your meal',
      '🧴 Wash your hands regularly today',
      '🥦 Eat a serving of green vegetables'
    ],
    tips: [
      'Your immune system is your body\'s defense army. Nourish it well.',
      'Black seed oil has powerful immune-boosting properties.',
      'Vitamin C supports white blood cell function.',
      'Garlic contains compounds that enhance immune response.',
      'Adequate sleep is crucial for immune system repair.'
    ],
    quotes: [
      'Health is not everything, but without health, everything is nothing. – Arthur Schopenhauer',
      'The greatest wealth is health. – Ralph Waldo Emerson',
      'Your body hears everything your mind says. – Naomi Judd',
      'The immune system is like a second brain. – Unknown',
      'Prevention is better than cure. – Desiderius Erasmus'
    ],
    journalPrompts: [
      'How do you typically care for your health?',
      'What makes you feel strong and resilient?',
      'How does your lifestyle affect your immunity?',
      'Describe your relationship with your body.',
      'What health goals are most important to you?'
    ]
  },
  anxiety: {
    checklist: [
      '🫁 Practice 4-7-8 breathing technique',
      '🌿 Take calming herbs like chamomile or lavender',
      '📱 Limit screen time and social media',
      '🧘 Do a 5-minute grounding meditation',
      '📝 Write down your worries and let them go'
    ],
    tips: [
      'Anxiety is often future-focused. Ground yourself in the present moment.',
      'Breathing exercises activate your parasympathetic nervous system.',
      'Chamomile and lavender have natural calming properties.',
      'Regular meditation rewires your brain for calm.',
      'Anxiety is not you - it\'s a pattern you can change.'
    ],
    quotes: [
      'Anxiety does not empty tomorrow of its sorrows, but only empties today of its strength. – Charles Spurgeon',
      'Worry does not take away tomorrow\'s troubles, it takes away today\'s peace. – Randy Armstrong',
      'The only way to deal with an unfree world is to become so absolutely free that your very existence is an act of rebellion. – Albert Camus',
      'Peace is not the absence of problems, but the ability to deal with them. – Unknown',
      'You are not your anxiety. You are the awareness behind it. – Unknown'
    ],
    journalPrompts: [
      'What triggers your anxiety most often?',
      'How do you know when anxiety is building?',
      'What coping strategies work best for you?',
      'Describe a time when you felt completely at peace.',
      'What would help you feel more secure and grounded?'
    ]
  },
  hormonal: {
    checklist: [
      '🥑 Eat healthy fats for hormone production',
      '💧 Stay hydrated throughout the day',
      '😴 Prioritize 8 hours of quality sleep',
      '🚶 Take a gentle walk in nature',
      '🧘 Practice stress-reducing activities'
    ],
    tips: [
      'Hormones are chemical messengers that affect every system in your body.',
      'Healthy fats are essential for hormone production and balance.',
      'Sleep is crucial for hormone regulation and repair.',
      'Stress management is key to hormonal harmony.',
      'Regular movement helps regulate insulin and other hormones.'
    ],
    quotes: [
      'Your hormones are your body\'s orchestra. Keep them in harmony. – Unknown',
      'Balance is not something you find, it\'s something you create. – Jana Kingsford',
      'The body is a temple. Treat it with respect. – Unknown',
      'Health is harmony. – Unknown',
      'Your body is always working for your highest good. – Unknown'
    ],
    journalPrompts: [
      'How do you notice hormonal changes in your body?',
      'What lifestyle factors affect your hormonal balance?',
      'How does your cycle affect your energy and mood?',
      'Describe your relationship with your body\'s natural rhythms.',
      'What would optimal hormonal health look like for you?'
    ]
  },
  general: {
    checklist: [
      '💧 Drink 500ml of warm water and reflect on your intention',
      '🧘 Spend 5 minutes in thought clearing or meditation',
      '📖 Write a short journal entry about your progress',
      '🚶 Take a gentle walk and focus on your breath',
      '🌟 Celebrate a small win from today'
    ],
    tips: [
      'Your body has an incredible ability to heal. Trust the process.',
      'Small daily actions compound into remarkable results.',
      'Healing is not a destination, but a journey of self-discovery.',
      'Every cell in your body is working for your wellness.',
      'Patience and consistency are the keys to lasting health.'
    ],
    quotes: [
      'Health is the greatest gift, contentment the greatest wealth, faithfulness the best relationship. – Buddha',
      'The doctor of the future will give no medicine, but will instruct his patient in the care of the human frame. – Thomas Edison',
      'Let food be thy medicine and medicine be thy food. – Hippocrates',
      'The natural healing force within each of us is the greatest force in getting well. – Hippocrates',
      'Healing is a matter of time, but it is sometimes also a matter of opportunity. – Hippocrates'
    ],
    journalPrompts: [
      'What does healing mean to you?',
      'How do you want to feel in your body and mind?',
      'What small changes would make the biggest difference?',
      'Describe your ideal state of health and wellness.',
      'What motivates you to take care of yourself?'
    ]
  }
};

// NLP-based goal parsing
export function parseUserGoals(userInput: string): GoalTags {
  const input = userInput.toLowerCase();
  const goals: GoalTags = {};

  // Enhanced keyword patterns with context awareness
  const goalPatterns = {
    sleep: [
      'sleep', 'insomnia', 'rest', 'bedtime', 'wake up', 'tired', 'exhausted',
      'can\'t sleep', 'sleepless', 'sleeping problems', 'sleep quality',
      'early bedtime', 'sleep schedule', 'sleep routine', 'restless'
    ],
    stress: [
      'stress', 'anxiety', 'worry', 'tension', 'pressure', 'overwhelmed',
      'burnout', 'mental load', 'stressful', 'calm', 'relax', 'peace',
      'stress management', 'stress relief', 'anxiety relief', 'tense'
    ],
    digestion: [
      'digestion', 'stomach', 'bloating', 'gas', 'indigestion', 'gut',
      'belly', 'digestive', 'upset stomach', 'nausea', 'constipation',
      'diarrhea', 'food', 'eating', 'meal', 'diet', 'appetite'
    ],
    energy: [
      'energy', 'tired', 'fatigue', 'weakness', 'lethargy', 'exhausted',
      'low energy', 'boost energy', 'vitality', 'strength', 'power',
      'motivation', 'drive', 'active', 'energetic', 'lively'
    ],
    spiritual: [
      'spiritual', 'mindfulness', 'meditation', 'prayer', 'reflection',
      'inner peace', 'soul', 'spirit', 'consciousness', 'awareness',
      'zen', 'calm', 'tranquil', 'serenity', 'inner healing', 'purpose'
    ],
    immunity: [
      'immunity', 'immune', 'sick', 'infection', 'cold', 'flu',
      'weak immune', 'boost immunity', 'health', 'wellness',
      'prevention', 'disease', 'illness', 'symptoms', 'sick'
    ],
    anxiety: [
      'anxiety', 'mental', 'depression', 'mood', 'sad', 'hopeless',
      'panic', 'fear', 'nervous', 'worried', 'mental health',
      'psychological', 'emotional', 'mind', 'brain', 'uneasy'
    ],
    hormonal: [
      'hormonal', 'hormone', 'pms', 'period', 'menstrual', 'pregnancy',
      'menopause', 'thyroid', 'endocrine', 'balance', 'regulation',
      'fertility', 'reproductive', 'cycle', 'mood swings'
    ]
  };

  // Score-based goal detection
  const goalScores: { [key: string]: number } = {};

  for (const [goal, patterns] of Object.entries(goalPatterns)) {
    let score = 0;
    for (const pattern of patterns) {
      if (input.includes(pattern)) {
        score += 1;
        // Bonus for exact matches
        if (input.includes(` ${pattern} `) || input.startsWith(pattern) || input.endsWith(pattern)) {
          score += 0.5;
        }
      }
    }
    if (score > 0) {
      goalScores[goal] = score;
    }
  }

  // Set goals based on scores (threshold of 0.5)
  for (const [goal, score] of Object.entries(goalScores)) {
    if (score >= 0.5) {
      goals[goal as keyof GoalTags] = true;
    }
  }

  // Context-aware adjustments
  if (input.includes('skin') || input.includes('acne') || input.includes('rash')) {
    goals.digestion = true; // Skin often related to gut health
    goals.immunity = true;  // And immune system
  }

  if (input.includes('weight') || input.includes('diet')) {
    goals.digestion = true;
    goals.energy = true;
  }

  if (input.includes('pain') || input.includes('ache')) {
    goals.stress = true; // Pain often related to stress
  }

  if (input.includes('focus') || input.includes('concentration')) {
    goals.energy = true;
    goals.stress = true;
  }

  // If no specific goals detected, default to general
  if (Object.keys(goals).length === 0) {
    goals.general = true;
  }

  return goals;
}

// Get daily content based on user's goals and current day
export function getDailyContent(user: User, day: number): DailyContent {
  const goalTags = user.goal_tags as GoalTags || { general: true };
  const activeGoals = Object.keys(goalTags).filter(goal => goalTags[goal as keyof GoalTags]);
  
  // Enhanced content selection with user progress awareness
  let primaryGoal = activeGoals[day % activeGoals.length] || 'general';
  
  // Adjust content based on user's current day and progress
  if (day <= 7) {
    // First week: Focus on building habits and foundation
    if (activeGoals.includes('sleep')) primaryGoal = 'sleep';
    else if (activeGoals.includes('stress')) primaryGoal = 'stress';
    else if (activeGoals.includes('digestion')) primaryGoal = 'digestion';
  } else if (day <= 14) {
    // Second week: Focus on deeper healing and energy
    if (activeGoals.includes('energy')) primaryGoal = 'energy';
    else if (activeGoals.includes('immunity')) primaryGoal = 'immunity';
    else if (activeGoals.includes('spiritual')) primaryGoal = 'spiritual';
  } else {
    // Final week: Focus on advanced practices and maintenance
    if (activeGoals.includes('anxiety')) primaryGoal = 'anxiety';
    else if (activeGoals.includes('hormonal')) primaryGoal = 'hormonal';
    else if (activeGoals.includes('spiritual')) primaryGoal = 'spiritual';
  }
  
  const content = GOAL_CONTENT_MAPPINGS[primaryGoal as keyof typeof GOAL_CONTENT_MAPPINGS];
  
  if (!content) {
    // Fallback to general content
    return {
      checklist: GOAL_CONTENT_MAPPINGS.general.checklist,
      tip: GOAL_CONTENT_MAPPINGS.general.tips[day % GOAL_CONTENT_MAPPINGS.general.tips.length],
      quote: GOAL_CONTENT_MAPPINGS.general.quotes[day % GOAL_CONTENT_MAPPINGS.general.quotes.length],
      journalPrompt: GOAL_CONTENT_MAPPINGS.general.journalPrompts[day % GOAL_CONTENT_MAPPINGS.general.journalPrompts.length],
      focus: `Day ${day} - Healing Journey`
    };
  }

  // Create personalized focus message
  const focusMessages = {
    sleep: `Day ${day} - Sleep & Rest Focus`,
    stress: `Day ${day} - Stress Management Focus`,
    digestion: `Day ${day} - Digestive Wellness Focus`,
    energy: `Day ${day} - Energy & Vitality Focus`,
    spiritual: `Day ${day} - Spiritual Wellness Focus`,
    immunity: `Day ${day} - Immune Health Focus`,
    anxiety: `Day ${day} - Mental Clarity Focus`,
    hormonal: `Day ${day} - Hormonal Balance Focus`,
    general: `Day ${day} - Holistic Healing Focus`
  };

  return {
    checklist: content.checklist,
    tip: content.tips[day % content.tips.length],
    quote: content.quotes[day % content.quotes.length],
    journalPrompt: content.journalPrompts[day % content.journalPrompts.length],
    focus: focusMessages[primaryGoal as keyof typeof focusMessages] || `Day ${day} - Healing Journey`
  };
}

// Update user's goal tags based on their input
export async function updateUserGoalTags(user: User, userInput: string): Promise<void> {
  const goalTags = parseUserGoals(userInput);
  user.goal_tags = goalTags;
  user.last_checklist_date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  user.current_day = 1;
  user.current_streak = 0;
  user.total_days_completed = 0;
}

// Get goal-specific wisdom quote
export function getGoalSpecificQuote(user: User): string {
  const goalTags = user.goal_tags as GoalTags || { general: true };
  const activeGoals = Object.keys(goalTags).filter(goal => goalTags[goal as keyof GoalTags]);
  
  if (activeGoals.length === 0) {
    activeGoals.push('general');
  }
  
  const primaryGoal = activeGoals[Math.floor(Math.random() * activeGoals.length)];
  const content = GOAL_CONTENT_MAPPINGS[primaryGoal as keyof typeof GOAL_CONTENT_MAPPINGS];
  
  if (!content) {
    return GOAL_CONTENT_MAPPINGS.general.quotes[Math.floor(Math.random() * GOAL_CONTENT_MAPPINGS.general.quotes.length)];
  }
  
  return content.quotes[Math.floor(Math.random() * content.quotes.length)];
}

// Get goal-specific journal prompt
export function getGoalSpecificJournalPrompt(user: User): string {
  const goalTags = user.goal_tags as GoalTags || { general: true };
  const activeGoals = Object.keys(goalTags).filter(goal => goalTags[goal as keyof GoalTags]);
  
  if (activeGoals.length === 0) {
    activeGoals.push('general');
  }
  
  const primaryGoal = activeGoals[Math.floor(Math.random() * activeGoals.length)];
  const content = GOAL_CONTENT_MAPPINGS[primaryGoal as keyof typeof GOAL_CONTENT_MAPPINGS];
  
  if (!content) {
    return GOAL_CONTENT_MAPPINGS.general.journalPrompts[Math.floor(Math.random() * GOAL_CONTENT_MAPPINGS.general.journalPrompts.length)];
  }
  
  return content.journalPrompts[Math.floor(Math.random() * content.journalPrompts.length)];
} 

export function mapGoalsToKnowledgeBase(goals: string[]): string[] {
  const knowledge = loadKnowledge();
  // Lowercase all keys for matching
  const kbKeys = Object.keys(knowledge).map(k => k.toLowerCase());
  return goals
    .map(g => g.toLowerCase())
    .map(g => {
      // Find the closest match (exact or partial)
      const exact = kbKeys.find(k => k === g);
      if (exact) return Object.keys(knowledge)[kbKeys.indexOf(exact)];
      const partial = kbKeys.find(k => g.includes(k) || k.includes(g));
      if (partial) return Object.keys(knowledge)[kbKeys.indexOf(partial)];
      return null;
    })
    .filter(Boolean) as string[];
} 