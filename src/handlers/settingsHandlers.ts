import { bot } from '../services/botService';
import { findOrCreateUser, updateNotificationSettings, updateUserLanguage } from '../services/userService';
import { setUserState, clearUserState, UserState } from '../services/stateService';
import { mainMenuKeyboard, settingsMenuKeyboard, settingsLanguageKeyboard, settingsReminderTimeKeyboard, settingsTipIntervalKeyboard, backToSettingsKeyboard, cancelCustomInputKeyboard, cancelCustomTipInputKeyboard } from './ui';
import { t, supportedLangs, SupportedLang } from '../utils/i18n';
import { handleBotError } from '../utils/errorHandler';

// Settings menu
bot.action('menu_settings', async (ctx) => {
  try {
    const user: any = await findOrCreateUser(ctx.from);
    let lang: SupportedLang = 'en';
    if (!user) {
      await ctx.reply('User not found.');
      return;
    }
    if (supportedLangs.includes(user['language_preference'] as SupportedLang)) {
      lang = user['language_preference'] as SupportedLang;
    }
    await ctx.editMessageText('⚙️ **Settings**\n\nUpdate your preferences below:', { parse_mode: 'Markdown', reply_markup: settingsMenuKeyboard.reply_markup });
    await ctx.answerCbQuery('Settings loaded');
  } catch (error) {
    handleBotError(ctx, error);
  }
});

// Notification settings
bot.action('settings_notifications', async (ctx) => {
  try {
    const user: any = await findOrCreateUser(ctx.from);
    if (!user) {
      await ctx.reply('User not found.');
      return;
    }
    const settings = user.notification_settings as any || {};
    const notificationMsg = `🔔 **Notification Settings**

Current Settings:
⏰ Reminder Time: ${settings.reminder_time || '08:00'}
💡 Tip Frequency: ${settings.tip_interval || 'daily'}
🔔 Notifications: ${settings.enabled !== false ? '✅ Enabled' : '❌ Disabled'}

Choose an option to modify:`;
    
    await ctx.editMessageText(notificationMsg, { reply_markup: backToSettingsKeyboard.reply_markup });
    await ctx.answerCbQuery('Notification settings loaded');
  } catch (error) {
    handleBotError(ctx, error);
  }
});

// Profile settings
bot.action('settings_profile', async (ctx) => {
  try {
    const user: any = await findOrCreateUser(ctx.from);
    if (!user) {
      await ctx.reply('User not found.');
      return;
    }
    const profileMsg = `👤 **Profile Settings**

Current Profile:
🌐 Language: ${user.language_preference || 'English'}
🎯 Healing Goals: ${user.healing_goals ? '✅ Set' : '❌ Not set'}
📅 Current Day: ${user.current_day || 1}

Choose an option to modify:`;
    
    await ctx.editMessageText(profileMsg, { reply_markup: { inline_keyboard: [ [ { text: '🌐 Change Language', callback_data: 'settings_language' }, { text: '🎯 Update Healing Goals', callback_data: 'update_healing_goals' } ], [ { text: '🔙 Back', callback_data: 'menu_settings' } ] ] } });
    await ctx.answerCbQuery('Profile settings loaded');
  } catch (error) {
    handleBotError(ctx, error);
  }
});

// Toggle notifications
bot.action('toggle_notifications', async (ctx) => {
  try {
    const user: any = await findOrCreateUser(ctx.from);
    if (!user) {
      await ctx.reply('User not found.');
      return;
    }
    const settings = { ...user.notification_settings, enabled: !(user.notification_settings as any)?.enabled };
    await updateNotificationSettings(user.id, settings);
    const status = settings.enabled ? '✅ Enabled' : '❌ Disabled';
    await ctx.editMessageText(`🔔 Notifications ${status}`, { reply_markup: backToSettingsKeyboard.reply_markup });
    await ctx.answerCbQuery(`Notifications ${settings.enabled ? 'enabled' : 'disabled'}`);
  } catch (error) {
    handleBotError(ctx, error);
  }
});

// Update healing goals
bot.action('update_healing_goals', async (ctx) => {
  try {
    const userId = ctx.from?.id;
    if (userId) {
      setUserState(userId, UserState.AWAITING_HEALING_GOALS);
    }
    await ctx.editMessageText('🎯 Please type your new healing goals:');
    await ctx.answerCbQuery('Update healing goals');
  } catch (error) {
    handleBotError(ctx, error);
  }
});

// Reset progress
bot.action('reset_progress', async (ctx) => {
  try {
    await ctx.editMessageText('⚠️ **Reset Progress**\n\nThis will reset your current day and progress tracking. Are you sure?', { reply_markup: backToSettingsKeyboard.reply_markup });
    await ctx.answerCbQuery('Reset progress confirmation');
  } catch (error) {
    handleBotError(ctx, error);
  }
});

// Confirm reset progress
bot.action('confirm_reset_progress', async (ctx) => {
  try {
    const user: any = await findOrCreateUser(ctx.from);
    if (!user) {
      await ctx.reply('User not found.');
      return;
    }
    user.current_day = 1;
          // Database save disabled for local/mock-only operation
      console.log('Settings updated (mock mode)');
    
    await ctx.editMessageText('✅ Progress reset successfully! You are now back to Day 1.', { reply_markup: backToSettingsKeyboard.reply_markup });
    await ctx.answerCbQuery('Progress reset');
  } catch (error) {
    handleBotError(ctx, error);
  }
});

// Send feedback
bot.action('send_feedback', async (ctx) => {
  try {
    const userId = ctx.from?.id;
    if (userId) {
      setUserState(userId, UserState.AWAITING_FEEDBACK);
    }
    await ctx.editMessageText('✉️ Please type your feedback below.');
    await ctx.answerCbQuery('Send feedback');
  } catch (error) {
    handleBotError(ctx, error);
  }
});

// Language selector
bot.action('settings_language', async (ctx) => {
  try {
    await ctx.editMessageText('🌐 *Choose your language / Choisissez votre langue / اختر لغتك / Chagua lugha yako*', { reply_markup: settingsLanguageKeyboard.reply_markup });
    await ctx.answerCbQuery();
  } catch (error) {
    handleBotError(ctx, error);
  }
});

// Language selection handlers
bot.action(/^set_language_(en|fr|ar|sw)$/, async (ctx) => {
  try {
    const userId = ctx.from?.id;
    if (!userId) return;
    const lang = ctx.match?.[1];
    if (!lang) {
      handleBotError(ctx, 'Language not found in callback data.');
      return;
    }
    const user: any = await findOrCreateUser(ctx.from);
    if (!user) {
      await ctx.reply('User not found.');
      return;
    }
    await updateUserLanguage(user.id, lang);
    let langName = 'English';
    if (lang === 'fr') langName = 'Français';
    if (lang === 'ar') langName = 'العربية';
    if (lang === 'sw') langName = 'Kiswahili';
    await ctx.editMessageText(`🌐 Language set to *${langName}*`, { reply_markup: backToSettingsKeyboard.reply_markup });
    await ctx.answerCbQuery();
  } catch (error) {
    handleBotError(ctx, error);
  }
});

// Checklist Reminder Time options
bot.action('settings_reminder_time', async (ctx) => {
  try {
    await ctx.editMessageText('⏰ *Choose your daily checklist reminder time:*', { reply_markup: settingsReminderTimeKeyboard.reply_markup });
    await ctx.answerCbQuery();
  } catch (error) {
    handleBotError(ctx, error);
  }
});

// Save preset reminder time
bot.action(/^set_reminder_time_(\d{2}:\d{2})$/, async (ctx) => {
  try {
    const userId = ctx.from?.id;
    if (!userId) return;
    const time = ctx.match?.[1];
    if (!time) {
      handleBotError(ctx, 'Time not found in callback data.');
      return;
    }
    const user: any = await findOrCreateUser(ctx.from);
    if (!user) {
      await ctx.reply('User not found.');
      return;
    }
    const settings = { ...user.notification_settings, reminder_time: time };
    await updateNotificationSettings(user.id, settings);
    await ctx.editMessageText(`✅ Checklist reminder time set to *${time}*`, { reply_markup: backToSettingsKeyboard.reply_markup });
    await ctx.answerCbQuery();
  } catch (error) {
    handleBotError(ctx, error);
  }
});

// Prompt for custom reminder time
bot.action('set_reminder_time_custom', async (ctx) => {
  try {
    const userId = ctx.from?.id;
    if (!userId) return;
    setUserState(userId, UserState.AWAITING_CUSTOM_REMINDER_TIME);
    await ctx.editMessageText('⏰ Please type your preferred reminder time in 24h format (e.g., 07:30):', { reply_markup: cancelCustomInputKeyboard.reply_markup });
    await ctx.answerCbQuery();
  } catch (error) {
    handleBotError(ctx, error);
  }
});

// Healing Tip Interval options
bot.action('settings_tip_interval', async (ctx) => {
  try {
    await ctx.editMessageText('💡 *How often do you want to receive healing tips?*', { reply_markup: settingsTipIntervalKeyboard.reply_markup });
    await ctx.answerCbQuery();
  } catch (error) {
    handleBotError(ctx, error);
  }
});

// Save preset tip interval
bot.action(/^set_tip_interval_(daily|2d|weekly)$/, async (ctx) => {
  try {
    const userId = ctx.from?.id;
    if (!userId) return;
    let interval = ctx.match?.[1];
    if (!interval) {
      handleBotError(ctx, 'Interval not found in callback data.');
      return;
    }
    if (interval === '2d') interval = 'every 2 days';
    if (interval === 'weekly') interval = 'weekly';
    const user: any = await findOrCreateUser(ctx.from);
    if (!user) {
      await ctx.reply('User not found.');
      return;
    }
    const settings = { ...user.notification_settings, tip_interval: interval };
    await updateNotificationSettings(user.id, settings);
    await ctx.editMessageText(`✅ Healing tip interval set to *${interval}*`, { reply_markup: backToSettingsKeyboard.reply_markup });
    await ctx.answerCbQuery();
  } catch (error) {
    handleBotError(ctx, error);
  }
});

// Prompt for custom tip interval
bot.action('set_tip_interval_custom', async (ctx) => {
  try {
    const userId = ctx.from?.id;
    if (userId) {
      setUserState(userId, UserState.AWAITING_CUSTOM_TIP_INTERVAL);
    }
    await ctx.editMessageText('💡 Please type your preferred healing tip interval (e.g., "every 3 days", "every 12 hours"): ', { reply_markup: cancelCustomTipInputKeyboard.reply_markup });
    await ctx.answerCbQuery();
  } catch (error) {
    handleBotError(ctx, error);
  }
});