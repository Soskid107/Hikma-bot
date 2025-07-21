import fs from 'fs';
import path from 'path';

const knowledgePath = path.join(__dirname, '../data/healing_knowledge.json');

let knowledge: any = null;
export function loadKnowledge() {
  if (!knowledge) {
    const raw = fs.readFileSync(knowledgePath, 'utf-8');
    knowledge = JSON.parse(raw);
  }
  return knowledge;
}

export function getLocalPlan(goals: string[], day: number) {
  const data = loadKnowledge();
  // Pick the first matching goal that exists in the knowledge base
  for (const goal of goals) {
    if (data[goal]) {
      const cat = data[goal];
      // Rotate checklist by day
      const checklistArr = cat.checklists[day % cat.checklists.length];
      // Shuffle checklist for variety
      const checklist = checklistArr.slice().sort(() => Math.random() - 0.5);
      // Pick a herb (rotate if multiple)
      const herb = cat.herbs[day % cat.herbs.length];
      // Pick a quote (rotate if multiple)
      const quote = cat.quotes[day % cat.quotes.length];
      return { checklist, herb, quote };
    }
  }
  // Fallback: general advice
  return {
    checklist: ["Drink water", "Take a walk", "Reflect on your goals"],
    herb: { name: "Mint", usage: "Steep in hot water, drink anytime" },
    quote: "Healing is a journey, not a destination."
  };
} 