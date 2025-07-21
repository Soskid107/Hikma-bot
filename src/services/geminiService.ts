import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY_HERE';

export interface GeminiPlanResult {
  goalTags: string[];
  checklist: string[];
  herb: { name: string; usage: string };
  quote: string;
}

export async function getGeminiPlan(userInput: string, goals: string[]): Promise<GeminiPlanResult | null> {
  const prompt = `You are a wise healing bot inspired by Ibn Sina. A user has these healing goals: ${goals.join(", ")}. Their input: "${userInput}".\n\nExtract:\n- Relevant goal tags (as an array of strings)\n- 3 personalized daily checklist items (as an array of strings)\n- 1 healing herb (object with name and usage)\n- 1 wisdom quote (string, Ibn Sina style)\n\nRespond in JSON with keys: goalTags, checklist, herb, quote.`;

  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent({ contents: [{ role: 'user', parts: [{ text: prompt }] }] });
    const text = result.response.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      console.error('[Gemini SDK] No text in response:', result.response);
      return null;
    }
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
      console.error('[Gemini SDK] No JSON found in response text:', text);
      return null;
    }
    const plan = JSON.parse(match[0]);
    if (!plan.goalTags || !plan.checklist || !plan.herb || !plan.quote) {
      console.error('[Gemini SDK] Incomplete plan structure:', plan);
      return null;
    }
    return plan as GeminiPlanResult;
  } catch (error) {
    console.error('[Gemini SDK] Error calling Gemini:', error);
    return null;
  }
} 