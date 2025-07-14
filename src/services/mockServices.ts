// Mock services for testing without database

export const getOrCreateTodayChecklist = async (user: any) => {
  return {
    id: Date.now(),
    user_id: user.id,
    warm_water: false,
    black_seed_garlic: false,
    light_food_before_8pm: false,
    sleep_time: false,
    thought_clearing: false,
    completion_percentage: 0,
    created_at: new Date(),
    updated_at: new Date()
  };
};

export const updateChecklistItem = async (checklistId: number, item: string, value: boolean) => {
  return {
    id: checklistId,
    user_id: 1,
    warm_water: item === 'warm_water' ? value : false,
    black_seed_garlic: item === 'black_seed_garlic' ? value : false,
    light_food_before_8pm: item === 'light_food_before_8pm' ? value : false,
    sleep_time: item === 'sleep_time' ? value : false,
    thought_clearing: item === 'thought_clearing' ? value : false,
    completion_percentage: value ? 20 : 0,
    created_at: new Date(),
    updated_at: new Date()
  };
};

export const getRandomWisdomQuote = async () => {
  const quotes = [
    "The body is the boat that carries us through life; we must keep it in good repair. - Ibn Sina",
    "Health is not merely the absence of disease, but the presence of vitality. - Ibn Sina",
    "The best medicine is prevention. - Ibn Sina",
    "Healing begins with the mind. - Ibn Sina",
    "Nature is the best physician. - Ibn Sina"
  ];
  return quotes[Math.floor(Math.random() * quotes.length)];
};

export interface HerbalTipMock {
  tip_text: string;
  herb_name: string;
  benefits: string[];
  usage_instructions: string;
  precautions: string;
}

export const getRandomHerbalTip = async (): Promise<HerbalTipMock> => {
  const tips: HerbalTipMock[] = [
    { 
      tip_text: "Black seed oil can help with digestion and immunity.",
      herb_name: "Black Seed Oil",
      benefits: ["Improves digestion", "Boosts immunity", "Anti-inflammatory"],
      usage_instructions: "Take 1 teaspoon daily with warm water",
      precautions: "Consult with healthcare provider if pregnant or on medication"
    },
    { 
      tip_text: "Garlic is a natural antibiotic and immune booster.",
      herb_name: "Garlic",
      benefits: ["Natural antibiotic", "Immune booster", "Heart health"],
      usage_instructions: "Consume 1-2 cloves daily",
      precautions: "May cause bad breath, avoid on empty stomach"
    },
    { 
      tip_text: "Warm water with lemon in the morning aids digestion.",
      herb_name: "Lemon Water",
      benefits: ["Aids digestion", "Detoxifies", "Vitamin C boost"],
      usage_instructions: "Drink warm water with lemon juice first thing in morning",
      precautions: "May affect tooth enamel, rinse mouth after"
    },
    { 
      tip_text: "Honey has natural antibacterial properties.",
      herb_name: "Raw Honey",
      benefits: ["Antibacterial", "Soothes throat", "Natural sweetener"],
      usage_instructions: "Take 1 teaspoon for sore throat or as natural sweetener",
      precautions: "Not suitable for children under 1 year"
    },
    { 
      tip_text: "Ginger tea can soothe stomach discomfort.",
      herb_name: "Ginger",
      benefits: ["Soothes nausea", "Anti-inflammatory", "Digestive aid"],
      usage_instructions: "Steep fresh ginger in hot water for 5-10 minutes",
      precautions: "May interact with blood thinners"
    }
  ];
  return tips[Math.floor(Math.random() * tips.length)];
};

export const getRandomHealingTip = async (): Promise<HerbalTipMock> => {
  // Reuse the same structure as getRandomHerbalTip for simplicity
  return getRandomHerbalTip();
};

export const getCustomizedChecklistItems = (user: any) => {
  return {
    warm_water: "Drink 500ml warm water",
    black_seed_garlic: "Take black seed + garlic",
    light_food_before_8pm: "Eat light food before 8pm",
    sleep_time: "Sleep by 10pm",
    thought_clearing: "5-min thought clearing"
  };
};

export const getUserProgressSummary = (user: any) => {
  return `🕯️ Day ${user.current_day || 1} - "Purify the Liver"`;
};

export const getDailyTip = (user: any) => {
  return "Today's focus: Hydration and mindful eating";
};

export const saveJournalEntry = async (userId: number, content: string) => {
  return {
    id: Date.now(),
    user_id: userId,
    content,
    created_at: new Date()
  };
};

export const countJournalEntries = async (userId: number) => {
  return 1; // Mock count
};

export const getHealthGuidance = async (symptom: string) => {
  return `For ${symptom}: Consider consulting with a healthcare provider and maintaining a healthy lifestyle.`;
};

export const getAvailableSymptoms = async () => {
  return ["headache", "fatigue", "digestive issues", "stress", "sleep problems"];
};

export const getRandomChecklistTip = async () => {
  return "Remember to stay hydrated and take deep breaths throughout the day.";
};

export const addHerbalTip = async (tip: string) => {
  return { id: Date.now(), tip_text: tip };
};

// Mock journal functions
export const listJournalEntries = async (user: any, page: number = 1, pageSize: number = 5) => {
  return {
    entries: [
      {
        id: 1,
        entry_date: new Date(),
        entry_text: 'Sample journal entry for testing...',
        created_at: new Date()
      }
    ],
    total: 1
  };
};

export const getJournalEntryById = async (user: any, entryId: number) => {
  return {
    id: entryId,
    entry_date: new Date(),
    entry_text: 'Sample journal entry for testing...',
    created_at: new Date()
  };
};

export const updateJournalEntryById = async (user: any, entryId: number, entryText: string) => {
  return {
    id: entryId,
    entry_date: new Date(),
    entry_text: entryText,
    created_at: new Date()
  };
};

export const deleteJournalEntryById = async (user: any, entryId: number) => {
  return true; // Mock successful deletion
}; 