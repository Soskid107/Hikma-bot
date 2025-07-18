const fetch = (url: any, init?: any) => import('node-fetch').then(mod => mod.default(url, init));

const fallbackQuotes = [
  // Ibn Sina (Avicenna) quotes
  '"The body is the boat that carries us through life; we must keep it in good repair." — Ibn Sina',
  '"The knowledge of anything, since all things have causes, is not acquired or complete unless it is known by its causes." — Ibn Sina',
  '"Medicine considers the human body as to the means by which it is cured and by which it is driven away from health." — Ibn Sina',
  
  // Health and Healing
  '"Health is not valued till sickness comes." — Thomas Fuller',
  '"The greatest wealth is health." — Ralph Waldo Emerson',
  '"Healing is a matter of time, but it is sometimes also a matter of opportunity." — Hippocrates',
  '"The art of healing comes from nature, not from the physician." — Paracelsus',
  '"The doctor of the future will give no medicine, but will instruct his patient in the care of the human frame." — Thomas Edison',
  '"Your body hears everything your mind says." — Naomi Judd',
  '"The mind and body are not separate. What affects one, affects the other." — Unknown',
  '"Healing takes courage, and we all have courage, even if we have to dig a little to find it." — Tori Amos',
  '"The only impossible journey is the one you never begin." — Tony Robbins',
  
  // Islamic and Middle Eastern Wisdom
  '"Seek knowledge from the cradle to the grave." — Prophet Muhammad (PBUH)',
  '"The ink of the scholar is more sacred than the blood of the martyr." — Prophet Muhammad (PBUH)',
  '"Verily, with hardship comes ease." — Quran 94:5',
  '"Allah does not burden a soul beyond that it can bear." — Quran 2:286',
  '"The best of people are those who are most beneficial to people." — Prophet Muhammad (PBUH)',
  
  // Ancient Wisdom
  '"The only true wisdom is in knowing you know nothing." — Socrates',
  '"Know thyself." — Ancient Greek Proverb',
  '"The unexamined life is not worth living." — Socrates',
  '"Wisdom begins in wonder." — Socrates',
  '"The mind is everything. What you think you become." — Buddha',
  '"Peace comes from within. Do not seek it without." — Buddha',
  '"Health is the greatest gift, contentment the greatest wealth, faithfulness the best relationship." — Buddha',
  
  // Modern Healing Wisdom
  '"Healing is an art. It takes time, it takes practice, it takes love." — Maza Dohta',
  '"The wound is the place where the Light enters you." — Rumi',
  '"What you seek is seeking you." — Rumi',
  '"Yesterday I was clever, so I wanted to change the world. Today I am wise, so I am changing myself." — Rumi',
  '"The cure for pain is in the pain." — Rumi',
  
  // Wellness and Mindfulness
  '"The present moment is filled with joy and happiness. If you are attentive, you will see it." — Thich Nhat Hanh',
  '"Breathing in, I calm body and mind. Breathing out, I smile." — Thich Nhat Hanh',
  '"Every morning we are born again. What we do today matters most." — Buddha',
  '"Happiness is not something ready-made. It comes from your own actions." — Dalai Lama',
  '"The purpose of our lives is to be happy." — Dalai Lama',
  
  // Life and Growth
  '"Life is not about waiting for the storm to pass but learning to dance in the rain." — Vivian Greene',
  '"The only way to do great work is to love what you do." — Steve Jobs',
  '"Your time is limited, don\'t waste it living someone else\'s life." — Steve Jobs',
  '"The future belongs to those who believe in the beauty of their dreams." — Eleanor Roosevelt',
  '"It is during our darkest moments that we must focus to see the light." — Aristotle',
  
  // Nature and Healing
  '"Look deep into nature, and then you will understand everything better." — Albert Einstein',
  '"In every walk with nature one receives far more than he seeks." — John Muir',
  '"Nature does not hurry, yet everything is accomplished." — Lao Tzu',
  '"The journey of a thousand miles begins with one step." — Lao Tzu',
  '"When you realize there is nothing lacking, the whole world belongs to you." — Lao Tzu'
];

export async function getRandomWisdomQuote(): Promise<string> {
  try {
    // Try multiple APIs for better reliability and variety
    const apis = [
      'https://api.quotable.io/random?tags=wisdom|philosophy|life',
      'https://api.quotable.io/random?tags=health|healing|wellness',
      'https://api.quotable.io/random?tags=inspiration|motivation',
      'https://api.quotable.io/random?tags=spirituality|religion',
      'https://api.quotable.io/random?tags=success|achievement',
      'https://api.quotable.io/random?tags=love|compassion',
      'https://api.quotable.io/random?tags=nature|environment',
      'https://api.quotable.io/random?tags=creativity|art',
      'https://api.quotable.io/random?tags=education|learning',
      'https://api.quotable.io/random?tags=peace|tranquility'
    ];
    
    // Shuffle the APIs for more randomness
    const shuffledApis = apis.sort(() => Math.random() - 0.5);
    
    for (const apiUrl of shuffledApis) {
      try {
        const response = await fetch(apiUrl, { 
          headers: {
            'User-Agent': 'Hikma-Bot/1.0'
          }
        });
        
        if (response.ok) {
          const data = await response.json() as { content: string; author: string };
          if (data.content && data.author) {
            return `"${data.content}" — ${data.author}`;
          }
        }
      } catch (apiError) {
        console.log(`API ${apiUrl} failed, trying next...`);
        continue;
      }
    }
    
    // If all APIs fail, return a random fallback quote
    const randomIndex = Math.floor(Math.random() * fallbackQuotes.length);
    return fallbackQuotes[randomIndex];
    
  } catch (error) {
    console.error('❌ Error fetching wisdom quote:', error);
    const randomIndex = Math.floor(Math.random() * fallbackQuotes.length);
    return fallbackQuotes[randomIndex];
  }
}

// Additional function to get a specific category of wisdom
export async function getWisdomByCategory(category: 'health' | 'spiritual' | 'philosophy' | 'healing'): Promise<string> {
  const categoryQuotes = {
    health: [
      '"The body is the boat that carries us through life; we must keep it in good repair." — Ibn Sina',
      '"Health is not valued till sickness comes." — Thomas Fuller',
      '"The greatest wealth is health." — Ralph Waldo Emerson',
      '"Your body hears everything your mind says." — Naomi Judd',
      '"The mind and body are not separate. What affects one, affects the other." — Unknown'
    ],
    spiritual: [
      '"The wound is the place where the Light enters you." — Rumi',
      '"What you seek is seeking you." — Rumi',
      '"Yesterday I was clever, so I wanted to change the world. Today I am wise, so I am changing myself." — Rumi',
      '"The present moment is filled with joy and happiness. If you are attentive, you will see it." — Thich Nhat Hanh',
      '"Happiness is not something ready-made. It comes from your own actions." — Dalai Lama'
    ],
    philosophy: [
      '"The only true wisdom is in knowing you know nothing." — Socrates',
      '"Know thyself." — Ancient Greek Proverb',
      '"The unexamined life is not worth living." — Socrates',
      '"Wisdom begins in wonder." — Socrates',
      '"The mind is everything. What you think you become." — Buddha'
    ],
    healing: [
      '"Healing is an art. It takes time, it takes practice, it takes love." — Maza Dohta',
      '"Healing takes courage, and we all have courage, even if we have to dig a little to find it." — Tori Amos',
      '"Healing is a matter of time, but it is sometimes also a matter of opportunity." — Hippocrates',
      '"The art of healing comes from nature, not from the physician." — Paracelsus',
      '"The cure for pain is in the pain." — Rumi'
    ]
  };
  
  const quotes = categoryQuotes[category];
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
}