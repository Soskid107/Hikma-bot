"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrCreateTodayChecklist = getOrCreateTodayChecklist;
exports.updateChecklistItem = updateChecklistItem;
const data_source_1 = __importDefault(require("../config/data-source"));
const DailyChecklist_1 = require("../entities/DailyChecklist");
async function getOrCreateTodayChecklist(user) {
    const checklistRepo = data_source_1.default.getRepository(DailyChecklist_1.DailyChecklist);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let checklist = await checklistRepo.findOne({
        where: { user: { id: user.id }, checklist_date: today },
        relations: ['user'],
    });
    if (!checklist) {
        checklist = checklistRepo.create({
            user,
            day_number: user.current_day,
            checklist_date: today,
            warm_water: false,
            black_seed_garlic: false,
            light_food_before_8pm: false,
            sleep_time: false,
            thought_clearing: false,
            completion_percentage: 0,
        });
        await checklistRepo.save(checklist);
    }
    return checklist;
}
async function updateChecklistItem(checklistId, item, value) {
    const checklistRepo = data_source_1.default.getRepository(DailyChecklist_1.DailyChecklist);
    const checklist = await checklistRepo.findOneBy({ id: checklistId });
    if (!checklist)
        throw new Error('Checklist not found');
    checklist[item] = value;
    // Recalculate completion percentage
    const items = [
        checklist.warm_water,
        checklist.black_seed_garlic,
        checklist.light_food_before_8pm,
        checklist.sleep_time,
        checklist.thought_clearing,
    ];
    checklist.completion_percentage = Math.round((items.filter(Boolean).length / items.length) * 100);
    await checklistRepo.save(checklist);
    return checklist;
}
