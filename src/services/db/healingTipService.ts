
import { HerbalTip } from '../../entities/HerbalTip';
import AppDataSource from '../../config/data-source';

export const getRandomHealingTip = async () => {
  const tipRepository = AppDataSource.getRepository(HerbalTip);
  const count = await tipRepository.count();
  if (count === 0) {
    return null;
  }
  const randomIndex = Math.floor(Math.random() * count);
  const tips = await tipRepository.find({ skip: randomIndex, take: 1 });
  return tips[0];
};
