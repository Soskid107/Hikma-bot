const axios = require('axios');
import { GoalTags } from './contentEngine';

// Web APIs and services for content fetching
interface WebContentResult {
  success: boolean;
  content?: string;
  source?: string;
  error?: string;
}

interface HerbalInfo {
  name: string;
  benefits: string[];
  usage: string;
  precautions: string;
  scientificName?: string;
}

interface HealthInfo {
  condition: string;
  symptoms: string[];
  naturalRemedies: string[];
  lifestyleTips: string[];
  whenToSeekHelp: string;
}

// Cache for web content to avoid repeated API calls
const contentCache = new Map<string, { content: any; timestamp: number }>();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Herbal database API (using a free herbal API)
async function fetchHerbalInfo(herbName: string): Promise<HerbalInfo | null> {
  try {
    const cacheKey = `herbal_${herbName.toLowerCase()}`;
    const cached = contentCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.content;
    }

    // Using a free herbal API (you can replace with any herbal API)
    // For now, return null to use fallback content
    return null;
    
    // Uncomment when you have a real API:
    /*
    const response = await axios.get(`https://api.example.com/herbs/${herbName}`, {
      timeout: 5000,
      headers: {
        'User-Agent': 'Hikma-Bot/1.0'
      }
    });

    if (response.data) {
      const data = response.data as any;
      const herbalInfo: HerbalInfo = {
        name: data.name || herbName,
        benefits: data.benefits || [],
        usage: data.usage || 'Consult with a healthcare provider',
        precautions: data.precautions || 'Use with caution',
        scientificName: data.scientificName
      };
      
      contentCache.set(cacheKey, { content: herbalInfo, timestamp: Date.now() });
      return herbalInfo;
    }
    */
  } catch (error) {
    console.log(`Could not fetch herbal info for ${herbName}:`, (error as Error).message);
  }
  
  return null;
}

// Health information from reliable sources
async function fetchHealthInfo(condition: string): Promise<HealthInfo | null> {
  try {
    const cacheKey = `health_${condition.toLowerCase()}`;
    const cached = contentCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.content;
    }

    // Using a health API (you can replace with any health information API)
    // For now, return null to use fallback content
    return null;
    
    // Uncomment when you have a real API:
    /*
    const response = await axios.get(`https://api.example.com/health/${condition}`, {
      timeout: 5000,
      headers: {
        'User-Agent': 'Hikma-Bot/1.0'
      }
    });

    if (response.data) {
      const data = response.data as any;
      const healthInfo: HealthInfo = {
        condition: data.condition || condition,
        symptoms: data.symptoms || [],
        naturalRemedies: data.naturalRemedies || [],
        lifestyleTips: data.lifestyleTips || [],
        whenToSeekHelp: data.whenToSeekHelp || 'Consult a healthcare provider'
      };
      
      contentCache.set(cacheKey, { content: healthInfo, timestamp: Date.now() });
      return healthInfo;
    }
    */
  } catch (error) {
    console.log(`Could not fetch health info for ${condition}:`, (error as Error).message);
  }
  
  return null;
}

// AI content generation (using OpenAI or similar)
async function generateAIContent(prompt: string, goalTags: GoalTags): Promise<string | null> {
  try {
    const cacheKey = `ai_${prompt.toLowerCase().replace(/\s+/g, '_')}`;
    const cached = contentCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.content;
    }

    // Using OpenAI API (you'll need to set OPENAI_API_KEY in your .env)
    if (process.env.OPENAI_API_KEY) {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are Hikma, a wise healing bot inspired by Ibn Sina (Avicenna). 
            Provide healing advice that combines traditional wisdom with modern understanding.
            Focus on natural remedies, spiritual wellness, and holistic health.
            Keep responses concise, warm, and encouraging.`
          },
          {
            role: 'user',
            content: `Generate healing content for: ${prompt}
            User's healing goals: ${Object.keys(goalTags).filter(goal => goalTags[goal as keyof GoalTags]).join(', ')}
            Provide practical, actionable advice.`
          }
        ],
        max_tokens: 200,
        temperature: 0.7
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      const data = response.data as any;
      if (data?.choices?.[0]?.message?.content) {
        const aiContent = data.choices[0].message.content;
        contentCache.set(cacheKey, { content: aiContent, timestamp: Date.now() });
        return aiContent;
      }
    }
  } catch (error) {
    console.log('Could not generate AI content:', (error as Error).message);
  }
  
  return null;
}

// Weather-based recommendations
async function getWeatherBasedRecommendations(location: string): Promise<string | null> {
  try {
    const cacheKey = `weather_${location.toLowerCase()}`;
    const cached = contentCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.content;
    }

    // Using a weather API (you can replace with any weather API)
    // For now, return null to use fallback content
    return null;
    
    // Uncomment when you have a real API:
    /*
    const response = await axios.get(`https://api.example.com/weather/${location}`, {
      timeout: 5000,
      headers: {
        'User-Agent': 'Hikma-Bot/1.0'
      }
    });

    if (response.data) {
      const weather = response.data as any;
      let recommendation = '';
      
      if (weather.temperature < 10) {
        recommendation = '🌡️ Cold weather tip: Warm herbal teas like ginger and cinnamon can boost your immunity and keep you cozy.';
      } else if (weather.temperature > 30) {
        recommendation = '🌡️ Hot weather tip: Stay hydrated with cooling herbs like mint and cucumber. Consider light, refreshing meals.';
      } else if (weather.humidity > 70) {
        recommendation = '💧 High humidity tip: Herbs like turmeric and black pepper can help with moisture-related discomfort.';
      }
      
      if (recommendation) {
        contentCache.set(cacheKey, { content: recommendation, timestamp: Date.now() });
        return recommendation;
      }
    }
    */
  } catch (error) {
    console.log('Could not fetch weather data:', (error as Error).message);
  }
  
  return null;
}

// Real-time health news and research
async function getHealthNews(topic: string): Promise<string | null> {
  try {
    const cacheKey = `news_${topic.toLowerCase()}`;
    const cached = contentCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.content;
    }

    // Using a news API (you can replace with any news API)
    // For now, return null to use fallback content
    return null;
    
    // Uncomment when you have a real API:
    /*
    const response = await axios.get(`https://api.example.com/news/health/${topic}`, {
      timeout: 5000,
      headers: {
        'User-Agent': 'Hikma-Bot/1.0'
      }
    });

    const data = response.data as any;
    if (data?.articles?.[0]) {
      const article = data.articles[0];
      const newsContent = `📰 **Latest Health Insight**: ${article.title}\n\n${article.description}\n\n*Source: ${article.source}*`;
      
      contentCache.set(cacheKey, { content: newsContent, timestamp: Date.now() });
      return newsContent;
    }
    */
  } catch (error) {
    console.log('Could not fetch health news:', (error as Error).message);
  }
  
  return null;
}

// Main function to get optimal recommendations
export async function getOptimalRecommendations(
  goalTags: GoalTags, 
  userInput?: string,
  location?: string
): Promise<{
  herbalTip?: string;
  healthAdvice?: string;
  weatherTip?: string;
  newsInsight?: string;
  aiSuggestion?: string;
}> {
  const recommendations: any = {};
  
  try {
    // Enhanced goal analysis
    const activeGoals = Object.keys(goalTags).filter(goal => goalTags[goal as keyof GoalTags]);
    const goalPriority = analyzeGoalPriority(goalTags, userInput);
    
    // Get personalized herbal tip based on primary goal
    if (goalPriority.primary) {
      const herbalTip = getGoalSpecificHerbalTip(goalPriority.primary);
      if (herbalTip) {
        recommendations.herbalTip = `🌿 **${goalPriority.primary.charAt(0).toUpperCase() + goalPriority.primary.slice(1)} Focus**: ${herbalTip}`;
      }
    }
    
    // Get comprehensive health advice
    if (userInput) {
      const healthAdvice = await getRealTimeHealthInfo(userInput);
      if (healthAdvice) {
        const advice = healthAdvice.naturalRemedies.slice(0, 3).join(', ');
        recommendations.healthAdvice = `💡 **Personalized Health Insight**: ${advice}`;
      }
    }
    
    // Get weather-based recommendations with goal context
    if (location) {
      const weatherTip = await getWeatherBasedRecommendations(location);
      if (weatherTip) {
        const goalContext = getWeatherGoalContext(goalPriority.primary);
        recommendations.weatherTip = `${weatherTip}\n\n${goalContext}`;
      }
    }
    
    // Get relevant health news
    const newsTopic = goalPriority.primary || 'wellness';
    const newsInsight = await getHealthNews(newsTopic);
    if (newsInsight) recommendations.newsInsight = newsInsight;
    
    // Generate intelligent AI-powered suggestion
    const aiPrompt = generateIntelligentPrompt(goalTags, goalPriority, userInput);
    const aiSuggestion = await generateAIContent(aiPrompt, goalTags);
    if (aiSuggestion) {
      recommendations.aiSuggestion = `🤖 **AI-Powered Insight**: ${aiSuggestion}`;
    }
    
  } catch (error) {
    console.error('Error fetching optimal recommendations:', error);
  }
  
  return recommendations;
}

// Helper function to analyze goal priority
function analyzeGoalPriority(goalTags: GoalTags, userInput?: string): { primary: string; secondary: string[] } {
  const activeGoals = Object.keys(goalTags).filter(goal => goalTags[goal as keyof GoalTags]);
  
  if (activeGoals.length === 0) {
    return { primary: 'general', secondary: [] };
  }
  
  // Analyze user input for urgency indicators
  const urgentKeywords = ['severe', 'bad', 'terrible', 'awful', 'really', 'very', 'extremely'];
  const isUrgent = userInput && urgentKeywords.some(keyword => userInput.toLowerCase().includes(keyword));
  
  if (isUrgent) {
    // Prioritize stress/anxiety for urgent cases
    if (activeGoals.includes('stress')) return { primary: 'stress', secondary: activeGoals.filter(g => g !== 'stress') };
    if (activeGoals.includes('anxiety')) return { primary: 'anxiety', secondary: activeGoals.filter(g => g !== 'anxiety') };
  }
  
  // Default priority based on health impact
  const priorityOrder = ['sleep', 'stress', 'digestion', 'energy', 'immunity', 'anxiety', 'spiritual', 'hormonal'];
  
  for (const goal of priorityOrder) {
    if (activeGoals.includes(goal)) {
      return { primary: goal, secondary: activeGoals.filter(g => g !== goal) };
    }
  }
  
  return { primary: activeGoals[0], secondary: activeGoals.slice(1) };
}

// Helper function to get weather context based on goals
function getWeatherGoalContext(primaryGoal?: string): string {
  const contexts = {
    sleep: '💤 Consider adjusting your sleep environment based on weather conditions.',
    stress: '🧘 Weather can affect stress levels. Practice extra self-care during extreme conditions.',
    digestion: '🥗 Weather changes can impact digestion. Stay hydrated and eat seasonally.',
    energy: '⚡ Weather affects energy levels. Adjust your activity accordingly.',
    immunity: '💪 Weather changes can challenge immunity. Boost your defenses.',
    anxiety: '😌 Weather can trigger anxiety. Use calming techniques during storms.',
    spiritual: '🕯️ Connect with nature\'s rhythms through weather changes.',
    general: '🌤️ Let weather guide your healing practices today.'
  };
  
  return contexts[primaryGoal as keyof typeof contexts] || contexts.general;
}

// Helper function to generate intelligent prompts
function generateIntelligentPrompt(goalTags: GoalTags, goalPriority: any, userInput?: string): string {
  const activeGoals = Object.keys(goalTags).filter(goal => goalTags[goal as keyof GoalTags]);
  
  let prompt = `As a holistic health advisor inspired by Ibn Sina's wisdom, provide a personalized recommendation for someone with these health goals: ${activeGoals.join(', ')}.`;
  
  if (userInput) {
    prompt += ` They mentioned: "${userInput}". `;
  }
  
  prompt += `Primary focus: ${goalPriority.primary}. `;
  prompt += `Provide practical, actionable advice that combines traditional wisdom with modern understanding. Keep it concise but meaningful.`;
  
  return prompt;
}

// Helper function to get goal-specific herbal tips
function getGoalSpecificHerbalTip(goal: string): string {
  const herbalTips = {
    sleep: 'Chamomile tea before bed promotes relaxation and better sleep quality.',
    stress: 'Lavender essential oil can help reduce stress and anxiety levels.',
    digestion: 'Ginger tea supports healthy digestion and reduces bloating.',
    energy: 'Green tea provides sustained energy without the crash of coffee.',
    immunity: 'Echinacea and vitamin C-rich foods boost your immune system.',
    anxiety: 'Ashwagandha is an adaptogen that helps manage stress and anxiety.',
    spiritual: 'Sage tea promotes mental clarity and spiritual awareness.',
    hormonal: 'Evening primrose oil supports hormonal balance naturally.',
    general: 'Black seed oil provides comprehensive health benefits.'
  };
  
  return herbalTips[goal as keyof typeof herbalTips] || herbalTips.general;
}

// Function to get real-time herbal data
export async function getRealTimeHerbalData(herbName: string): Promise<HerbalInfo | null> {
  return await fetchHerbalInfo(herbName);
}

// Function to get real-time health information
export async function getRealTimeHealthInfo(condition: string): Promise<HealthInfo | null> {
  return await fetchHealthInfo(condition);
}

// Function to clear cache (useful for testing or when you want fresh data)
export function clearContentCache(): void {
  contentCache.clear();
  console.log('Content cache cleared');
}

// Function to get cache statistics
export function getCacheStats(): { size: number; entries: string[] } {
  return {
    size: contentCache.size,
    entries: Array.from(contentCache.keys())
  };
} 