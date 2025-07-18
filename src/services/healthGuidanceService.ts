const fetch = (url: any, init?: any) => import('node-fetch').then(mod => mod.default(url, init));

interface SymptomInfo {
  symptom: string;
  possible_causes: string[];
  general_advice: string[];
  when_to_see_doctor: string[];
  natural_remedies: string[];
  lifestyle_tips: string[];
  ibn_sina_wisdom: string;
  keywords: string[]; // Add keywords for search functionality
}

const symptomDatabase: { [key: string]: SymptomInfo } = {
  headache: {
    symptom: "Headache",
    keywords: ["headache", "head pain", "migraine", "tension", "head ache", "brain pain"],
    possible_causes: [
      "Stress and tension",
      "Dehydration",
      "Poor sleep",
      "Eye strain",
      "Sinus congestion",
      "Caffeine withdrawal",
      "Hunger or low blood sugar"
    ],
    general_advice: [
      "Rest in a quiet, dark room",
      "Stay hydrated with water",
      "Practice deep breathing exercises",
      "Apply gentle pressure to temples",
      "Take breaks from screens"
    ],
    when_to_see_doctor: [
      "Severe, sudden headache",
      "Headache with fever and stiff neck",
      "Headache after head injury",
      "Headache with confusion or vision changes",
      "Persistent headache for several days"
    ],
    natural_remedies: [
      "Peppermint oil on temples",
      "Ginger tea",
      "Lavender essential oil",
      "Cold compress on forehead",
      "Massage therapy"
    ],
    lifestyle_tips: [
      "Maintain regular sleep schedule",
      "Practice stress management",
      "Stay hydrated throughout the day",
      "Take regular breaks from work",
      "Exercise regularly"
    ],
    ibn_sina_wisdom: "Ibn Sina taught that headaches often stem from imbalances in the body's humors. Rest, proper nutrition, and maintaining balance in daily activities are key to prevention."
  },
  
  fatigue: {
    symptom: "Fatigue",
    keywords: ["fatigue", "tired", "exhausted", "low energy", "weakness", "lethargy", "sleepy"],
    possible_causes: [
      "Lack of quality sleep",
      "Poor nutrition",
      "Stress and anxiety",
      "Dehydration",
      "Lack of physical activity",
      "Vitamin deficiencies",
      "Overwork and burnout"
    ],
    general_advice: [
      "Ensure 7-9 hours of quality sleep",
      "Eat balanced, nutritious meals",
      "Stay hydrated",
      "Take regular breaks",
      "Practice stress management"
    ],
    when_to_see_doctor: [
      "Persistent fatigue for weeks",
      "Fatigue with unexplained weight loss",
      "Fatigue with chest pain or shortness of breath",
      "Fatigue with depression or anxiety",
      "Fatigue affecting daily activities"
    ],
    natural_remedies: [
      "Ginseng tea",
      "Green tea in moderation",
      "Ashwagandha supplements",
      "Regular exercise",
      "Sunlight exposure"
    ],
    lifestyle_tips: [
      "Establish consistent sleep routine",
      "Exercise regularly but don't overdo it",
      "Practice mindfulness or meditation",
      "Limit caffeine and alcohol",
      "Spend time in nature"
    ],
    ibn_sina_wisdom: "Ibn Sina emphasized that fatigue is often a sign that the body needs rest and proper nourishment. He recommended balancing work with rest and maintaining regular sleep patterns."
  },
  
  digestive_issues: {
    symptom: "Digestive Issues (Bloating, Gas, Discomfort)",
    keywords: ["digestive", "bloating", "gas", "stomach", "belly", "indigestion", "upset stomach", "nausea", "constipation", "diarrhea"],
    possible_causes: [
      "Poor eating habits",
      "Food intolerances",
      "Stress and anxiety",
      "Dehydration",
      "Lack of fiber",
      "Eating too quickly",
      "Irregular meal times"
    ],
    general_advice: [
      "Eat slowly and mindfully",
      "Chew food thoroughly",
      "Stay hydrated",
      "Avoid eating late at night",
      "Practice portion control"
    ],
    when_to_see_doctor: [
      "Severe abdominal pain",
      "Persistent vomiting or diarrhea",
      "Blood in stool",
      "Unexplained weight loss",
      "Symptoms lasting more than a week"
    ],
    natural_remedies: [
      "Ginger tea",
      "Peppermint tea",
      "Chamomile tea",
      "Probiotic foods (yogurt, kefir)",
      "Fennel seeds"
    ],
    lifestyle_tips: [
      "Eat regular meals",
      "Include fiber-rich foods",
      "Exercise regularly",
      "Manage stress",
      "Avoid processed foods"
    ],
    ibn_sina_wisdom: "Ibn Sina taught that digestive health is the foundation of overall wellness. He recommended eating in moderation, chewing thoroughly, and maintaining regular meal times."
  },
  
  sleep_problems: {
    symptom: "Sleep Problems",
    keywords: ["sleep", "insomnia", "sleepless", "restless", "wake up", "can't sleep", "sleeping problems"],
    possible_causes: [
      "Stress and anxiety",
      "Poor sleep hygiene",
      "Caffeine or alcohol consumption",
      "Irregular sleep schedule",
      "Screen time before bed",
      "Physical discomfort",
      "Environmental factors"
    ],
    general_advice: [
      "Establish a regular sleep schedule",
      "Create a relaxing bedtime routine",
      "Keep bedroom cool and dark",
      "Avoid screens 1 hour before bed",
      "Exercise regularly but not close to bedtime"
    ],
    when_to_see_doctor: [
      "Chronic insomnia for weeks",
      "Sleep problems with mood changes",
      "Excessive daytime sleepiness",
      "Sleep apnea symptoms",
      "Sleep problems affecting daily life"
    ],
    natural_remedies: [
      "Chamomile tea",
      "Lavender essential oil",
      "Warm milk with honey",
      "Meditation or deep breathing",
      "Valerian root tea"
    ],
    lifestyle_tips: [
      "Maintain consistent sleep/wake times",
      "Create a comfortable sleep environment",
      "Limit caffeine after 2 PM",
      "Practice relaxation techniques",
      "Avoid large meals before bed"
    ],
    ibn_sina_wisdom: "Ibn Sina emphasized the importance of proper sleep for health and healing. He recommended sleeping early, rising early, and maintaining a peaceful sleep environment."
  },
  
  stress_anxiety: {
    symptom: "Stress and Anxiety",
    keywords: ["stress", "anxiety", "worried", "nervous", "panic", "overwhelmed", "tense", "fear"],
    possible_causes: [
      "Work pressure",
      "Personal relationships",
      "Financial concerns",
      "Health worries",
      "Life changes",
      "Lack of sleep",
      "Poor coping mechanisms"
    ],
    general_advice: [
      "Practice deep breathing exercises",
      "Take regular breaks",
      "Talk to trusted friends or family",
      "Set realistic goals",
      "Learn to say no when needed"
    ],
    when_to_see_doctor: [
      "Persistent anxiety affecting daily life",
      "Panic attacks",
      "Thoughts of self-harm",
      "Severe depression",
      "Inability to function normally"
    ],
    natural_remedies: [
      "Chamomile tea",
      "Lavender essential oil",
      "Ashwagandha supplements",
      "Regular exercise",
      "Mindfulness meditation"
    ],
    lifestyle_tips: [
      "Exercise regularly",
      "Practice stress management techniques",
      "Maintain social connections",
      "Get adequate sleep",
      "Limit caffeine and alcohol"
    ],
    ibn_sina_wisdom: "Ibn Sina taught that mental health is as important as physical health. He recommended balancing work with rest, maintaining social connections, and practicing moderation in all things."
  },

  back_pain: {
    symptom: "Back Pain",
    keywords: ["back pain", "backache", "spine", "lower back", "upper back", "backache", "back hurt"],
    possible_causes: [
      "Poor posture",
      "Muscle strain",
      "Sitting for long periods",
      "Heavy lifting",
      "Stress and tension",
      "Lack of exercise",
      "Sleeping position"
    ],
    general_advice: [
      "Maintain good posture",
      "Take regular breaks from sitting",
      "Use proper lifting techniques",
      "Apply heat or cold therapy",
      "Gentle stretching exercises"
    ],
    when_to_see_doctor: [
      "Severe or persistent pain",
      "Pain radiating down legs",
      "Pain with numbness or weakness",
      "Pain after injury",
      "Pain affecting daily activities"
    ],
    natural_remedies: [
      "Turmeric with warm milk",
      "Ginger tea",
      "Epsom salt baths",
      "Gentle yoga stretches",
      "Massage therapy"
    ],
    lifestyle_tips: [
      "Exercise regularly",
      "Maintain healthy weight",
      "Use ergonomic furniture",
      "Practice good posture",
      "Sleep on a supportive mattress"
    ],
    ibn_sina_wisdom: "Ibn Sina emphasized the importance of movement and proper posture for back health. He recommended regular exercise and maintaining balance in physical activities."
  },

  joint_pain: {
    symptom: "Joint Pain",
    keywords: ["joint pain", "arthritis", "knee pain", "hip pain", "shoulder pain", "elbow pain", "joints hurt", "stiff joints"],
    possible_causes: [
      "Overuse or injury",
      "Age-related wear",
      "Inflammatory conditions",
      "Poor posture",
      "Lack of exercise",
      "Weight issues",
      "Nutritional deficiencies"
    ],
    general_advice: [
      "Rest the affected joint",
      "Apply ice or heat therapy",
      "Gentle range of motion exercises",
      "Maintain healthy weight",
      "Use proper body mechanics"
    ],
    when_to_see_doctor: [
      "Severe or persistent pain",
      "Joint swelling or redness",
      "Limited range of motion",
      "Pain affecting daily activities",
      "Pain with fever"
    ],
    natural_remedies: [
      "Turmeric supplements",
      "Ginger tea",
      "Omega-3 fatty acids",
      "Epsom salt baths",
      "Gentle stretching"
    ],
    lifestyle_tips: [
      "Exercise regularly",
      "Maintain healthy weight",
      "Eat anti-inflammatory foods",
      "Stay hydrated",
      "Practice stress management"
    ],
    ibn_sina_wisdom: "Ibn Sina taught that joint health requires balance between movement and rest. He recommended gentle exercise, proper nutrition, and avoiding excessive strain."
  },

  skin_problems: {
    symptom: "Skin Problems (Acne, Rashes, Dryness)",
    keywords: ["skin", "acne", "rash", "dry skin", "eczema", "psoriasis", "skin problems", "breakout", "pimples"],
    possible_causes: [
      "Hormonal changes",
      "Poor diet",
      "Stress",
      "Allergies",
      "Dehydration",
      "Harsh skincare products",
      "Environmental factors"
    ],
    general_advice: [
      "Keep skin clean and moisturized",
      "Stay hydrated",
      "Avoid touching face frequently",
      "Use gentle skincare products",
      "Protect from sun exposure"
    ],
    when_to_see_doctor: [
      "Severe or persistent rashes",
      "Skin infections",
      "Unexplained skin changes",
      "Painful skin conditions",
      "Skin problems with other symptoms"
    ],
    natural_remedies: [
      "Aloe vera gel",
      "Coconut oil",
      "Honey masks",
      "Tea tree oil (diluted)",
      "Oatmeal baths"
    ],
    lifestyle_tips: [
      "Eat a balanced diet",
      "Manage stress",
      "Get adequate sleep",
      "Exercise regularly",
      "Avoid harsh chemicals"
    ],
    ibn_sina_wisdom: "Ibn Sina emphasized that skin health reflects internal wellness. He recommended proper nutrition, hydration, and maintaining balance in lifestyle habits."
  },

  respiratory_issues: {
    symptom: "Respiratory Issues (Cough, Congestion, Shortness of Breath)",
    keywords: ["cough", "congestion", "breathing", "shortness of breath", "chest", "lungs", "respiratory", "cold", "flu", "sore throat"],
    possible_causes: [
      "Common cold or flu",
      "Allergies",
      "Air pollution",
      "Smoking or secondhand smoke",
      "Stress and anxiety",
      "Poor air quality",
      "Respiratory infections"
    ],
    general_advice: [
      "Stay hydrated",
      "Rest adequately",
      "Use humidifier",
      "Avoid irritants",
      "Practice deep breathing"
    ],
    when_to_see_doctor: [
      "Severe shortness of breath",
      "Chest pain",
      "High fever",
      "Persistent cough for weeks",
      "Difficulty breathing at rest"
    ],
    natural_remedies: [
      "Honey and warm water",
      "Steam inhalation",
      "Eucalyptus oil",
      "Ginger tea",
      "Saltwater gargle"
    ],
    lifestyle_tips: [
      "Avoid smoking",
      "Exercise regularly",
      "Maintain clean environment",
      "Practice stress management",
      "Get adequate sleep"
    ],
    ibn_sina_wisdom: "Ibn Sina taught that respiratory health is essential for life. He recommended clean air, proper breathing techniques, and avoiding respiratory irritants."
  },

  eye_strain: {
    symptom: "Eye Strain and Vision Problems",
    keywords: ["eye strain", "vision", "eyes", "blurry", "dry eyes", "eye pain", "headache", "screen time", "reading"],
    possible_causes: [
      "Prolonged screen time",
      "Poor lighting",
      "Reading for long periods",
      "Dry eyes",
      "Poor posture",
      "Uncorrected vision",
      "Stress and fatigue"
    ],
    general_advice: [
      "Follow 20-20-20 rule (20 min break, 20 feet away, 20 seconds)",
      "Ensure proper lighting",
      "Blink regularly",
      "Take regular breaks",
      "Maintain good posture"
    ],
    when_to_see_doctor: [
      "Severe eye pain",
      "Vision changes",
      "Eye redness or swelling",
      "Persistent headaches",
      "Difficulty seeing clearly"
    ],
    natural_remedies: [
      "Warm compress on eyes",
      "Cucumber slices",
      "Rose water eye drops",
      "Eye exercises",
      "Adequate rest"
    ],
    lifestyle_tips: [
      "Limit screen time",
      "Use proper lighting",
      "Maintain good posture",
      "Get regular eye checkups",
      "Practice eye exercises"
    ],
    ibn_sina_wisdom: "Ibn Sina emphasized the importance of eye health and proper vision care. He recommended rest, good lighting, and protecting the eyes from strain."
  },

  weight_management: {
    symptom: "Weight Management Issues",
    keywords: ["weight", "obesity", "overweight", "lose weight", "gain weight", "diet", "body weight", "BMI"],
    possible_causes: [
      "Poor diet",
      "Lack of exercise",
      "Stress and emotional eating",
      "Hormonal imbalances",
      "Poor sleep",
      "Medical conditions",
      "Medication side effects"
    ],
    general_advice: [
      "Eat balanced, nutritious meals",
      "Exercise regularly",
      "Practice portion control",
      "Stay hydrated",
      "Get adequate sleep"
    ],
    when_to_see_doctor: [
      "Unexplained weight loss or gain",
      "Weight issues with other symptoms",
      "Difficulty losing weight despite efforts",
      "Weight affecting health",
      "Sudden weight changes"
    ],
    natural_remedies: [
      "Green tea",
      "Apple cider vinegar",
      "Lemon water",
      "Cinnamon",
      "Regular exercise"
    ],
    lifestyle_tips: [
      "Eat mindfully",
      "Exercise regularly",
      "Manage stress",
      "Get adequate sleep",
      "Maintain consistent routine"
    ],
    ibn_sina_wisdom: "Ibn Sina taught that weight management requires balance in diet, exercise, and lifestyle. He recommended moderation in eating and regular physical activity."
  },

  heart_health: {
    symptom: "Heart Health Concerns",
    keywords: ["heart", "cardiac", "chest pain", "heartbeat", "cardiovascular", "blood pressure", "cholesterol"],
    possible_causes: [
      "Poor diet",
      "Lack of exercise",
      "Stress",
      "Smoking",
      "High blood pressure",
      "High cholesterol",
      "Family history"
    ],
    general_advice: [
      "Eat heart-healthy diet",
      "Exercise regularly",
      "Manage stress",
      "Avoid smoking",
      "Maintain healthy weight"
    ],
    when_to_see_doctor: [
      "Chest pain or discomfort",
      "Shortness of breath",
      "Irregular heartbeat",
      "Swelling in legs",
      "Dizziness or fainting"
    ],
    natural_remedies: [
      "Garlic",
      "Hawthorn berry",
      "Omega-3 fatty acids",
      "Coenzyme Q10",
      "Regular exercise"
    ],
    lifestyle_tips: [
      "Eat heart-healthy foods",
      "Exercise regularly",
      "Manage stress",
      "Avoid smoking",
      "Get regular checkups"
    ],
    ibn_sina_wisdom: "Ibn Sina emphasized that heart health is fundamental to overall wellness. He recommended moderation in diet, regular exercise, and maintaining emotional balance."
  },

  immune_system: {
    symptom: "Weak Immune System",
    keywords: ["immune", "immunity", "sick", "infection", "cold", "flu", "weak immune", "frequent illness"],
    possible_causes: [
      "Poor nutrition",
      "Lack of sleep",
      "Stress",
      "Lack of exercise",
      "Vitamin deficiencies",
      "Chronic illness",
      "Poor hygiene"
    ],
    general_advice: [
      "Eat nutritious foods",
      "Get adequate sleep",
      "Exercise regularly",
      "Manage stress",
      "Practice good hygiene"
    ],
    when_to_see_doctor: [
      "Frequent infections",
      "Slow healing wounds",
      "Persistent fatigue",
      "Recurring illnesses",
      "Unexplained symptoms"
    ],
    natural_remedies: [
      "Vitamin C-rich foods",
      "Zinc supplements",
      "Echinacea",
      "Probiotics",
      "Adequate rest"
    ],
    lifestyle_tips: [
      "Eat balanced diet",
      "Exercise regularly",
      "Get adequate sleep",
      "Manage stress",
      "Practice good hygiene"
    ],
    ibn_sina_wisdom: "Ibn Sina taught that a strong immune system requires proper nutrition, rest, and balance in lifestyle. He recommended preventive care and maintaining overall health."
  },

  mental_health: {
    symptom: "Mental Health Concerns",
    keywords: ["mental health", "depression", "anxiety", "mood", "sad", "hopeless", "mental illness", "psychology"],
    possible_causes: [
      "Stress and trauma",
      "Chemical imbalances",
      "Life changes",
      "Poor sleep",
      "Social isolation",
      "Work pressure",
      "Financial stress"
    ],
    general_advice: [
      "Talk to trusted friends or family",
      "Practice self-care",
      "Maintain routine",
      "Get adequate sleep",
      "Exercise regularly"
    ],
    when_to_see_doctor: [
      "Persistent sadness or anxiety",
      "Thoughts of self-harm",
      "Difficulty functioning",
      "Changes in behavior",
      "Substance abuse"
    ],
    natural_remedies: [
      "Meditation",
      "Deep breathing exercises",
      "St. John's Wort",
      "Omega-3 fatty acids",
      "Regular exercise"
    ],
    lifestyle_tips: [
      "Maintain social connections",
      "Practice stress management",
      "Get adequate sleep",
      "Exercise regularly",
      "Seek professional help when needed"
    ],
    ibn_sina_wisdom: "Ibn Sina emphasized that mental health is as important as physical health. He recommended balance in life, social connections, and seeking help when needed."
  }
};

// Search function to find relevant symptoms based on keywords
function searchSymptoms(query: string): string[] {
  const searchTerm = query.toLowerCase().trim();
  const results: string[] = [];
  
  // First, try exact matches
  for (const [key, info] of Object.entries(symptomDatabase)) {
    if (info.symptom.toLowerCase().includes(searchTerm) || 
        key.toLowerCase().includes(searchTerm)) {
      results.push(key);
    }
  }
  
  // If no exact matches, search through keywords
  if (results.length === 0) {
    for (const [key, info] of Object.entries(symptomDatabase)) {
      if (info.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm))) {
        results.push(key);
      }
    }
  }
  
  // If still no results, try partial matches
  if (results.length === 0) {
    for (const [key, info] of Object.entries(symptomDatabase)) {
      const allText = `${info.symptom} ${info.keywords.join(' ')}`.toLowerCase();
      if (allText.includes(searchTerm)) {
        results.push(key);
      }
    }
  }
  
  return results;
}

export async function getHealthGuidance(symptom: string): Promise<string> {
  const normalizedSymptom = symptom.toLowerCase().trim().replace(/\s+/g, '_');
  let symptomInfo = symptomDatabase[normalizedSymptom];
  
  // If exact match not found, search for similar symptoms
  if (!symptomInfo) {
    const searchResults = searchSymptoms(symptom);
    
    if (searchResults.length > 0) {
      // If one result found, use it
      if (searchResults.length === 1) {
        symptomInfo = symptomDatabase[searchResults[0]];
      } else {
        // If multiple results found, show options
        const options = searchResults.map(key => `• ${symptomDatabase[key].symptom}`).join('\n');
        return `🔍 **Search Results for "${symptom}"**

I found several related health topics. Please choose one:

${options}

💡 **How to use:** /health [exact symptom name]
Example: /health headache

📋 **Or search for:** /health [keyword]
Example: /health pain, /health sleep, /health stress`;
      }
    }
  }
  
  if (!symptomInfo) {
    return `🤔 I don't have specific guidance for "${symptom}" yet.

💡 **Try searching with different keywords:**
• pain, ache, hurt
• sleep, tired, fatigue
• stress, anxiety, worry
• skin, rash, acne
• stomach, digestive, bloating
• heart, chest, breathing
• weight, diet, exercise

💡 **General Wellness Tips:**
• Stay hydrated with water
• Get adequate sleep (7-9 hours)
• Exercise regularly
• Eat a balanced diet
• Practice stress management
• Consult a healthcare professional for persistent symptoms

⚠️ **Important:** This is general wellness advice only. For medical concerns, please consult a qualified healthcare provider.

🩺 **When to See a Doctor:**
• Severe or persistent symptoms
• Symptoms affecting daily activities
• Unexplained weight loss or gain
• Fever with other symptoms
• Any concerning changes in health

📋 **Available Symptoms:**
• Headache, Fatigue, Digestive Issues
• Sleep Problems, Stress & Anxiety
• Back Pain, Joint Pain, Skin Problems
• Respiratory Issues, Eye Strain
• Weight Management, Heart Health
• Immune System, Mental Health

💡 **How to use:** /health [symptom]
Example: /health headache`;
  }
  
  return `🏥 **Health Guidance: ${symptomInfo.symptom}**

📋 **Possible Causes:**
${symptomInfo.possible_causes.map(cause => `• ${cause}`).join('\n')}

💡 **General Advice:**
${symptomInfo.general_advice.map(advice => `• ${advice}`).join('\n')}

🩺 **When to See a Doctor:**
${symptomInfo.when_to_see_doctor.map(warning => `• ${warning}`).join('\n')}

🌿 **Natural Remedies:**
${symptomInfo.natural_remedies.map(remedy => `• ${remedy}`).join('\n')}

💪 **Lifestyle Tips:**
${symptomInfo.lifestyle_tips.map(tip => `• ${tip}`).join('\n')}

🕯️ **Ibn Sina's Wisdom:**
"${symptomInfo.ibn_sina_wisdom}"

⚠️ **Important Disclaimer:**
This is educational information only and should not replace professional medical advice. Always consult a qualified healthcare provider for proper diagnosis and treatment.

🔄 **Get guidance for another symptom:** /health [symptom]`;
}

export function getAvailableSymptoms(): string[] {
  return Object.keys(symptomDatabase);
} 