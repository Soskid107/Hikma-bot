"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomHerbalTip = getRandomHerbalTip;
const data_source_1 = __importDefault(require("../config/data-source"));
const HerbalTip_1 = require("../entities/HerbalTip");
async function getRandomHerbalTip() {
    const repo = data_source_1.default.getRepository(HerbalTip_1.HerbalTip);
    const count = await repo.count();
    if (count === 0) {
        return `🌿 Today's Herbal Wisdom

Bitter Leaf (Ewuro) 🍃
Local Names: Ewuro (Yoruba), Onugbu (Igbo), Shiwaka (Hausa)

Ibn Sina's Wisdom: "Bitter herbs cleanse the liver and purify the blood."

Benefits:
• Liver detoxification
• Blood sugar regulation
• Digestive health
• Antimicrobial properties

Usage: Fresh leaves in morning smoothie or evening tea
⚠️ Caution: Avoid during pregnancy`;
    }
    const tips = await repo.find();
    const tip = tips[Math.floor(Math.random() * tips.length)];
    return `🌿 Today's Herbal Wisdom

${tip.herb_name} (${tip.scientific_name || ''})
Local Names: ${tip.local_names ? Object.values(tip.local_names).join(', ') : 'N/A'}

${tip.tip_text}

Benefits:
${tip.benefits ? tip.benefits.map(b => '• ' + b).join('\n') : 'N/A'}

Usage: ${tip.usage_instructions || 'N/A'}
${tip.precautions ? '⚠️ ' + tip.precautions : ''}`;
}
