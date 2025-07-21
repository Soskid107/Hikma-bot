import axios from 'axios';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY_HERE'; // Fill this in

interface GeminiApiResponse {
  candidates?: { content?: { parts?: { text?: string }[] } }[]
}

export interface GeminiPlanResult {
  goalTags: string[];
  checklist: string[];
  herb: { name: string; usage: string };
  quote: string;
}

export async function getGeminiPlan(userInput: string, goals: string[]): Promise<GeminiPlanResult | null> {
  const prompt = `You are a wise healing bot inspired by Ibn Sina. A user has these healing goals: ${goals.join(", ")}. Their input: "${userInput}".\n\nExtract:\n- Relevant goal tags (as an array of strings)\n- 3 personalized daily checklist items (as an array of strings)\n- 1 healing herb (object with name and usage)\n- 1 wisdom quote (string, Ibn Sina style)\n\nRespond in JSON with keys: goalTags, checklist, herb, quote.`;

  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{ role: 'user', parts: [{ text: prompt }] }]
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
      }
    );
    const data = response.data as GeminiApiResponse;
    if (!data || !Array.isArray(data.candidates) || !data.candidates[0]?.content?.parts?.[0]?.text) return null;
    const text = data.candidates[0].content.parts[0].text;
    if (!text) return null;
    // Try to parse JSON from the text
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;
    const plan = JSON.parse(match[0]);
    // Validate structure
    if (!plan.goalTags || !plan.checklist || !plan.herb || !plan.quote) return null;
    return plan as GeminiPlanResult;
  } catch (error) {
    console.error('Gemini API error:', error);
    return null;
  }
} 