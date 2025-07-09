"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOrCreateUser = findOrCreateUser;
const data_source_1 = __importDefault(require("../config/data-source"));
const User_1 = require("../entities/User");
async function findOrCreateUser(telegramUser) {
    const userRepo = data_source_1.default.getRepository(User_1.User);
    let user = await userRepo.findOne({ where: { telegram_id: telegramUser.id } });
    if (!user) {
        user = userRepo.create({
            telegram_id: telegramUser.id,
            username: telegramUser.username,
            first_name: telegramUser.first_name,
            last_name: telegramUser.last_name,
            language_preference: telegramUser.language_code || 'en',
            last_interaction: new Date(),
        });
        await userRepo.save(user);
    }
    else {
        user.username = telegramUser.username;
        user.first_name = telegramUser.first_name;
        user.last_name = telegramUser.last_name;
        user.language_preference = telegramUser.language_code || user.language_preference;
        user.last_interaction = new Date();
        await userRepo.save(user);
    }
    return user;
}
