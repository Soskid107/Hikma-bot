// Web API Configuration for Hikma Bot
// Replace these with actual API endpoints and keys

export const WEB_API_CONFIG = {
  // OpenAI Configuration (for AI content generation)
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    model: 'gpt-3.5-turbo',
    maxTokens: 200,
    temperature: 0.7
  },

  // Herbal Database APIs (replace with actual APIs)
  herbal: {
    // Example: Herbal API endpoints
    baseUrl: process.env.HERBAL_API_URL || 'https://api.example.com/herbs',
    apiKey: process.env.HERBAL_API_KEY || '',
    timeout: 5000
  },

  // Health Information APIs
  health: {
    // Example: Health API endpoints
    baseUrl: process.env.HEALTH_API_URL || 'https://api.example.com/health',
    apiKey: process.env.HEALTH_API_KEY || '',
    timeout: 5000
  },

  // Weather API
  weather: {
    // Example: OpenWeatherMap or similar
    baseUrl: process.env.WEATHER_API_URL || 'https://api.openweathermap.org/data/2.5',
    apiKey: process.env.WEATHER_API_KEY || '',
    timeout: 5000
  },

  // News API
  news: {
    // Example: NewsAPI or similar
    baseUrl: process.env.NEWS_API_URL || 'https://newsapi.org/v2',
    apiKey: process.env.NEWS_API_KEY || '',
    timeout: 5000
  },

  // Cache Configuration
  cache: {
    duration: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    maxSize: 100 // Maximum number of cached items
  }
};

// Real API endpoints you can use (uncomment and configure):

// 1. OpenAI API (for AI content generation)
// Get API key from: https://platform.openai.com/api-keys
// OPENAI_API_KEY=your_openai_api_key_here

// 2. OpenWeatherMap API (for weather-based recommendations)
// Get API key from: https://openweathermap.org/api
// WEATHER_API_URL=https://api.openweathermap.org/data/2.5
// WEATHER_API_KEY=your_weather_api_key_here

// 3. NewsAPI (for health news)
// Get API key from: https://newsapi.org/
// NEWS_API_URL=https://newsapi.org/v2
// NEWS_API_KEY=your_news_api_key_here

// 4. Herbal APIs (some options):
// - Natural Medicines API
// - HerbMed API
// - Custom herbal database

// 5. Health APIs (some options):
// - Health.gov API
// - WHO API
// - Custom health database

// Example .env configuration:
/*
OPENAI_API_KEY=sk-your-openai-key-here
WEATHER_API_KEY=your-weather-api-key-here
NEWS_API_KEY=your-news-api-key-here
HERBAL_API_URL=https://your-herbal-api.com
HEALTH_API_URL=https://your-health-api.com
*/ 