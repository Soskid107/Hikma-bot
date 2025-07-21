# 🌐 Web-Aware Features - Hikma Bot

## 🚀 Overview

The Hikma bot now includes intelligent web scraping and AI integration capabilities that provide real-time, optimal recommendations to users. These features enhance the bot's ability to deliver personalized, up-to-date health and wellness advice.

## 🤖 Features Implemented

### 1. AI Content Generation
- **OpenAI Integration**: Uses GPT-3.5-turbo for dynamic content generation
- **Context-Aware**: Considers user's healing goals when generating advice
- **Personalized Responses**: Tailored recommendations based on user input

### 2. Real-Time Data Fetching
- **Herbal Information**: Live herbal database access
- **Health Information**: Real-time health condition data
- **Weather-Based Recommendations**: Location-specific advice
- **Health News**: Latest research and insights

### 3. Intelligent Caching
- **24-Hour Cache**: Reduces API calls and improves performance
- **Smart Invalidation**: Automatic cache refresh for fresh data
- **Memory Management**: Configurable cache size limits

## 🔧 Setup Instructions

### 1. Environment Variables
Add these to your `.env` file:

```env
# OpenAI API (for AI content generation)
OPENAI_API_KEY=sk-your-openai-api-key-here

# Weather API (OpenWeatherMap recommended)
WEATHER_API_KEY=your-weather-api-key-here
WEATHER_API_URL=https://api.openweathermap.org/data/2.5

# News API (NewsAPI recommended)
NEWS_API_KEY=your-news-api-key-here
NEWS_API_URL=https://newsapi.org/v2

# Herbal Database API (optional)
HERBAL_API_KEY=your-herbal-api-key-here
HERBAL_API_URL=https://your-herbal-api.com

# Health Information API (optional)
HEALTH_API_KEY=your-health-api-key-here
HEALTH_API_URL=https://your-health-api.com
```

### 2. API Keys Setup

#### OpenAI API
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create an account and get your API key
3. Add to `.env` as `OPENAI_API_KEY`

#### OpenWeatherMap API
1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for free API access
3. Add to `.env` as `WEATHER_API_KEY`

#### NewsAPI
1. Visit [NewsAPI](https://newsapi.org/)
2. Get your free API key
3. Add to `.env` as `NEWS_API_KEY`

### 3. Dependencies
Install required packages:
```bash
npm install axios
```

## 📱 User Commands

### `/optimal` - Get Optimal Recommendations
Provides real-time, web-sourced recommendations based on user's goals.

**Example Response:**
```
🤖 **Optimal Recommendations for You**

🌿 **Black Seed**
**Benefits:**
• Boosts immune system
• Improves digestion
• Reduces inflammation

**Usage:** Take 1/4 teaspoon with honey daily
⚠️ **Precautions:** Consult with healthcare provider if pregnant

🌡️ **Weather Tip:** Cold weather tip: Warm herbal teas like ginger and cinnamon can boost your immunity and keep you cozy.

📰 **Latest Health Insight**: New Study Shows Connection Between Sleep Quality and Immune Function
```

### AI-Powered Text Responses
Users can ask health questions directly and get AI-powered responses:

**User Input:** "I'm having trouble sleeping, what can help?"

**Bot Response:**
```
🤖 **AI Healing Insight**

Based on your sleep goals, here are some natural remedies:

• **Chamomile Tea**: Drink 1 hour before bed for its calming properties
• **Lavender Essential Oil**: Add a few drops to your pillow
• **4-7-8 Breathing**: Inhale for 4, hold for 7, exhale for 8
• **Blue Light Blocking**: Avoid screens 1 hour before bed
• **Cool Room**: Keep bedroom temperature between 65-68°F

Remember: Consistency is key. Try these for at least a week to see results.
```

## 🔄 How It Works

### 1. Content Fetching Flow
```
User Request → Check Cache → Fetch from API → Cache Result → Return Response
```

### 2. Fallback System
```
Web API Available → Use Real-Time Data
Web API Unavailable → Use Curated Content
```

### 3. Caching Strategy
- **Cache Duration**: 24 hours
- **Cache Keys**: Based on request parameters
- **Auto-Invalidation**: Timestamp-based expiration

## 🛠️ Configuration

### API Configuration
Edit `src/config/webApis.ts` to customize API endpoints:

```typescript
export const WEB_API_CONFIG = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    model: 'gpt-3.5-turbo',
    maxTokens: 200,
    temperature: 0.7
  },
  // ... other configurations
};
```

### Cache Configuration
```typescript
cache: {
  duration: 24 * 60 * 60 * 1000, // 24 hours
  maxSize: 100 // Maximum cached items
}
```

## 📊 Monitoring

### Cache Statistics
```typescript
import { getCacheStats } from '../services/webContentService';

const stats = getCacheStats();
console.log(`Cache size: ${stats.size}`);
console.log(`Cached entries: ${stats.entries.join(', ')}`);
```

### Clear Cache
```typescript
import { clearContentCache } from '../services/webContentService';

clearContentCache(); // Clears all cached content
```

## 🚨 Error Handling

The web service includes comprehensive error handling:

1. **API Timeouts**: 5-10 second timeouts for all requests
2. **Graceful Fallbacks**: Falls back to curated content if APIs fail
3. **Error Logging**: All errors are logged for debugging
4. **User-Friendly Messages**: Users don't see technical errors

## 🔒 Security Considerations

1. **API Key Protection**: All keys stored in environment variables
2. **Request Validation**: Input validation for all API calls
3. **Rate Limiting**: Built-in delays to respect API limits
4. **Error Sanitization**: No sensitive data in error messages

## 🎯 Best Practices

### For Development
1. **Use Free Tiers**: Start with free API tiers for testing
2. **Monitor Usage**: Track API call volumes
3. **Test Fallbacks**: Ensure curated content works when APIs are down
4. **Cache Testing**: Verify cache behavior in different scenarios

### For Production
1. **API Limits**: Monitor and respect API rate limits
2. **Cost Management**: Track API usage costs
3. **Backup Plans**: Have multiple API providers for critical features
4. **Performance**: Monitor response times and optimize caching

## 🔮 Future Enhancements

### Planned Features
1. **Multiple AI Models**: Support for different AI providers
2. **Advanced Caching**: Redis-based distributed caching
3. **Web Scraping**: Direct web scraping for specific health sites
4. **Machine Learning**: Learn from user interactions to improve recommendations

### API Integrations
1. **WHO Health API**: Official health information
2. **PubMed API**: Scientific research papers
3. **HerbMed API**: Comprehensive herbal database
4. **Custom APIs**: Integration with specific health platforms

## 📞 Support

For issues with web features:
1. Check API key configuration
2. Verify network connectivity
3. Review error logs
4. Test with fallback content

The web features are designed to enhance the bot's capabilities while maintaining reliability through comprehensive fallback systems. 