// Database service disabled for local/mock-only operation
// import AppDataSource from '../config/data-source';
import { HerbalTip } from '../entities/HerbalTip';

// Define a type for fallback tips to match HerbalTip fields
interface FallbackHerbalTip {
  name: string;
  scientific: string;
  local: string;
  wisdom: string;
  benefits: string[];
  usage: string;
  precautions?: string;
}

const fallbackHerbalTips: FallbackHerbalTip[] = [
  {
    name: "Black Seed (Nigella Sativa)",
    scientific: "Nigella sativa",
    local: "Habbat al-Barakah (Arabic), Kalonji (Hindi), Black Cumin",
    wisdom: "Ibn Sina: 'Black seed is the remedy for every disease except death.'",
    benefits: [
      "Immune system booster",
      "Anti-inflammatory properties",
      "Respiratory health support",
      "Digestive aid",
      "Skin health improvement"
    ],
    usage: "1 teaspoon daily with honey or in warm water",
    precautions: "Avoid in large doses during pregnancy"
  },
  {
    name: "Ginger (Zingiber officinale)",
    scientific: "Zingiber officinale",
    local: "Zanjabil (Arabic), Adrak (Hindi), Ginger",
    wisdom: "Ancient wisdom: 'Ginger warms the stomach and dispels cold.'",
    benefits: [
      "Digestive health",
      "Nausea relief",
      "Anti-inflammatory",
      "Circulation improvement",
      "Cold and flu prevention"
    ],
    usage: "Fresh ginger tea or 1-inch piece in hot water",
    precautions: "Avoid in excess if you have bleeding disorders"
  },
  {
    name: "Turmeric (Curcuma longa)",
    scientific: "Curcuma longa",
    local: "Haldi (Hindi), Kurkum (Arabic), Turmeric",
    wisdom: "Ayurvedic wisdom: 'Turmeric purifies the blood and strengthens the liver.'",
    benefits: [
      "Anti-inflammatory properties",
      "Liver detoxification",
      "Joint health",
      "Skin healing",
      "Antioxidant protection"
    ],
    usage: "1/2 teaspoon with warm milk or in cooking",
    precautions: "May interact with blood thinners"
  },
  {
    name: "Honey (Natural)",
    scientific: "Natural honey",
    local: "Asal (Arabic), Madhu (Sanskrit), Honey",
    wisdom: "Prophet Muhammad (PBUH): 'Honey is a remedy for every illness.'",
    benefits: [
      "Natural energy source",
      "Antibacterial properties",
      "Sore throat relief",
      "Wound healing",
      "Sleep aid"
    ],
    usage: "1 tablespoon in warm water or tea",
    precautions: "Not suitable for infants under 1 year"
  },
  {
    name: "Cinnamon (Cinnamomum)",
    scientific: "Cinnamomum verum",
    local: "Darchini (Arabic), Dalchini (Hindi), Cinnamon",
    wisdom: "Traditional wisdom: 'Cinnamon warms the body and regulates blood sugar.'",
    benefits: [
      "Blood sugar regulation",
      "Antioxidant properties",
      "Digestive health",
      "Anti-inflammatory",
      "Heart health support"
    ],
    usage: "1/4 teaspoon in tea or sprinkled on food",
    precautions: "Avoid in large amounts during pregnancy"
  },
  {
    name: "Mint (Mentha)",
    scientific: "Mentha spicata",
    local: "Na'na (Arabic), Pudina (Hindi), Mint",
    wisdom: "Ibn Sina: 'Mint cools the stomach and refreshes the mind.'",
    benefits: [
      "Digestive relief",
      "Mental clarity",
      "Breath freshener",
      "Stress reduction",
      "Headache relief"
    ],
    usage: "Fresh leaves in tea or chewing directly",
    precautions: "Generally safe, avoid in excess"
  },
  {
    name: "Garlic (Allium sativum)",
    scientific: "Allium sativum",
    local: "Thum (Arabic), Lahsun (Hindi), Garlic",
    wisdom: "Ancient wisdom: 'Garlic is nature's antibiotic.'",
    benefits: [
      "Immune system support",
      "Cardiovascular health",
      "Antibacterial properties",
      "Blood pressure regulation",
      "Detoxification aid"
    ],
    usage: "1-2 cloves daily, raw or cooked",
    precautions: "May cause heartburn in sensitive individuals"
  },
  {
    name: "Lemon (Citrus limon)",
    scientific: "Citrus limon",
    local: "Limon (Arabic), Nimbu (Hindi), Lemon",
    wisdom: "Traditional wisdom: 'Lemon purifies and alkalizes the body.'",
    benefits: [
      "Vitamin C boost",
      "Digestive aid",
      "Liver detoxification",
      "Skin health",
      "Immune support"
    ],
    usage: "Juice of 1/2 lemon in warm water",
    precautions: "May erode tooth enamel if consumed frequently"
  },
  {
    name: "Chamomile (Matricaria chamomilla)",
    scientific: "Matricaria chamomilla",
    local: "Babunaj (Arabic), Chamomile",
    wisdom: "European herbalism: 'Chamomile soothes the nerves and promotes sleep.'",
    benefits: [
      "Sleep aid",
      "Stress relief",
      "Digestive comfort",
      "Anti-inflammatory",
      "Skin soothing"
    ],
    usage: "1 teaspoon dried flowers in hot water",
    precautions: "Avoid if allergic to ragweed family"
  },
  {
    name: "Sage (Salvia officinalis)",
    scientific: "Salvia officinalis",
    local: "Maramiya (Arabic), Sage",
    wisdom: "Medieval wisdom: 'Sage preserves memory and wisdom.'",
    benefits: [
      "Memory enhancement",
      "Throat health",
      "Antioxidant properties",
      "Hormonal balance",
      "Anti-inflammatory"
    ],
    usage: "Fresh leaves in tea or as seasoning",
    precautions: "Avoid in large amounts during pregnancy"
  }
];

export async function getRandomHerbalTip(): Promise<string> {
  try {
    const randomTip: FallbackHerbalTip = fallbackHerbalTips[Math.floor(Math.random() * fallbackHerbalTips.length)];
    return `🌿 Today's Herbal Wisdom

${randomTip.name} (${randomTip.scientific})
Local Names: ${randomTip.local}

${randomTip.wisdom}

Benefits:
${randomTip.benefits.map((b: string) => '• ' + b).join('\n')}

Usage: ${randomTip.usage}
${randomTip.precautions ? '⚠️ ' + randomTip.precautions : ''}`;
  } catch (error) {
    console.error('❌ Error fetching herbal tip:', error);
    const randomTip: FallbackHerbalTip = fallbackHerbalTips[Math.floor(Math.random() * fallbackHerbalTips.length)];
    return `🌿 Today's Herbal Wisdom

${randomTip.name} (${randomTip.scientific})
Local Names: ${randomTip.local}

${randomTip.wisdom}

Benefits:
${randomTip.benefits.map((b: string) => '• ' + b).join('\n')}

Usage: ${randomTip.usage}
${randomTip.precautions ? '⚠️ ' + randomTip.precautions : ''}`;
  }
}

export async function getRandomHealingTip(category?: string): Promise<HerbalTip | null> {
  try {
    const fallbackTip: FallbackHerbalTip = fallbackHerbalTips[Math.floor(Math.random() * fallbackHerbalTips.length)];
    const tip = new HerbalTip();
    tip.tip_text = fallbackTip.wisdom;
    tip.herb_name = fallbackTip.name;
    tip.scientific_name = fallbackTip.scientific;
    tip.local_names = { english: fallbackTip.local };
    tip.benefits = fallbackTip.benefits;
    tip.usage_instructions = fallbackTip.usage;
    tip.precautions = fallbackTip.precautions;
    tip.category = 'general';
    tip.region = 'Global';
    return tip;
  } catch (error) {
    console.error('❌ Error fetching healing tip:', error);
    const fallbackTip: FallbackHerbalTip = fallbackHerbalTips[Math.floor(Math.random() * fallbackHerbalTips.length)];
    const tip = new HerbalTip();
    tip.tip_text = fallbackTip.wisdom;
    tip.herb_name = fallbackTip.name;
    tip.scientific_name = fallbackTip.scientific;
    tip.local_names = { english: fallbackTip.local };
    tip.benefits = fallbackTip.benefits;
    tip.usage_instructions = fallbackTip.usage;
    tip.precautions = fallbackTip.precautions;
    tip.category = 'general';
    tip.region = 'Global';
    return tip;
  }
} 

export async function addHerbalTip(tip_text: string): Promise<HerbalTip> {
  // const repo = AppDataSource.getRepository(HerbalTip);
  // const tip = repo.create({
  //   tip_text,
  //   herb_name: 'General',
  //   category: 'general',
  //   region: 'West Africa',
  // });
  // return await repo.save(tip);
  console.warn('addHerbalTip is disabled for local/mock-only operation.');
  return new HerbalTip(); // Return a dummy object
} 