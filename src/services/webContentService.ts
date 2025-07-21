import axios from 'axios';
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
    // Get active goals
    const activeGoals = Object.keys(goalTags).filter(goal => goalTags[goal as keyof GoalTags]);
    
    // Fetch herbal information for relevant goals
    if (activeGoals.includes('immunity') || activeGoals.includes('digestion')) {
      const herbalInfo = await fetchHerbalInfo('black seed');
      if (herbalInfo) {
        recommendations.herbalTip = `🌿 **${herbalInfo.name}**\n\n**Benefits:**\n${herbalInfo.benefits.map(b => `• ${b}`).join('\n')}\n\n**Usage:** ${herbalInfo.usage}\n\n⚠️ **Precautions:** ${herbalInfo.precautions}`;
      }
    }
    
    // Get health advice for specific conditions
    if (activeGoals.includes('sleep')) {
      const healthInfo = await fetchHealthInfo('insomnia');
      if (healthInfo) {
        recommendations.healthAdvice = `😴 **Sleep Support**\n\n**Natural Remedies:**\n${healthInfo.naturalRemedies.map(r => `• ${r}`).join('\n')}\n\n**Lifestyle Tips:**\n${healthInfo.lifestyleTips.map(t => `• ${t}`).join('\n')}`;
      }
    }
    
    // Get weather-based recommendations
    if (location) {
      const weatherTip = await getWeatherBasedRecommendations(location);
      if (weatherTip) {
        recommendations.weatherTip = weatherTip;
      }
    }
    
    // Get latest health news
    if (activeGoals.length > 0) {
      const primaryGoal = activeGoals[0];
      const newsInsight = await getHealthNews(primaryGoal);
      if (newsInsight) {
        recommendations.newsInsight = newsInsight;
      }
    }
    
    // Generate AI content if user provided specific input
    if (userInput) {
      const aiSuggestion = await generateAIContent(userInput, goalTags);
      if (aiSuggestion) {
        recommendations.aiSuggestion = `🤖 **AI Healing Insight**\n\n${aiSuggestion}`;
      }
    }
    
  } catch (error) {
    console.error('Error fetching optimal recommendations:', error);
  }
  
  return recommendations;
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