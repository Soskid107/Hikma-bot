
import { Markup } from 'telegraf';

export const mainMenuKeyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback('📜 Wisdom Quote', 'wisdom_quote'),
    Markup.button.callback('🌿 Herbal Tips', 'herbal_tips')
  ],
  [
    Markup.button.callback('📝 Journal', 'journal_menu'),
    Markup.button.callback('💡 Healing Tip', 'healing_tip')
  ],
  [
    Markup.button.callback('📋 Daily Checklist', 'daily_checklist'),
    Markup.button.callback('🏥 Health Guidance', 'health_guidance')
  ],
  [
    Markup.button.callback('🤖 Optimal Recommendations', 'optimal_recommendations'),
    Markup.button.callback('📊 My Stats', 'my_stats')
  ],
  [
    Markup.button.callback('⚙️ Settings', 'settings_menu')
  ]
]);

export const settingsMenuKeyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback('🔔 Notification Settings', 'settings_notifications'),
    Markup.button.callback('📅 Reminder Time', 'settings_reminder_time')
  ],
  [
    Markup.button.callback('🌱 Tip Frequency', 'settings_tip_frequency'),
    Markup.button.callback('👤 Profile Settings', 'settings_profile')
  ],
  [
    Markup.button.callback('🏠 Back to Main Menu', 'back_to_main_menu')
  ]
]);

export const journalMenuKeyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback('➕ Add New Entry', 'journal_add_new'),
    Markup.button.callback('📖 View History', 'journal_history')
  ],
  [
    Markup.button.callback('🏠 Back to Main Menu', 'back_to_main_menu')
  ]
]);

export const wisdomMenuKeyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback('🔄 Another Quote', 'wisdom_teach_me_more'),
    Markup.button.callback('🌿 Healing Wisdom', 'wisdom_healing')
  ],
  [
    Markup.button.callback('🧘 Spiritual Wisdom', 'wisdom_spiritual'),
    Markup.button.callback('💭 Philosophy', 'wisdom_philosophy')
  ],
  [
    Markup.button.callback('🏠 Back to Main Menu', 'back_to_main_menu')
  ]
]);

export const checklistMenuKeyboard = (checklist: any) => {
  const buttons = checklist.checklist_items.map((item: any, index: number) => {
    const emoji = ['💧', '🌿', '🥗', '😴', '🧘'][index] || '📋';
    return Markup.button.callback(
      `${emoji} ${item.text} ${item.completed ? '✅' : '❌'}`, 
      `toggle_item_${item.id}`
    );
  });
  
  // Group buttons into rows of 2
  const rows = [];
  for (let i = 0; i < buttons.length; i += 2) {
    const row = buttons.slice(i, i + 2);
    rows.push(row);
  }
  
  // Add back button
  rows.push([Markup.button.callback('🏠 Back to Main Menu', 'back_to_main_menu')]);
  
  return Markup.inlineKeyboard(rows);
};

export const herbalMenuKeyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback('🌿 Another Herbal Tip', 'herbal_another_tip')
  ],
  [
    Markup.button.callback('🏠 Back to Main Menu', 'back_to_main_menu')
  ]
]);

export const healthMenuKeyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback('🤕 Headache', 'health_headache'),
    Markup.button.callback('😴 Fatigue', 'health_fatigue')
  ],
  [
    Markup.button.callback('🤢 Digestive Issues', 'health_digestive_issues'),
    Markup.button.callback('😴 Sleep Problems', 'health_sleep_problems')
  ],
  [
    Markup.button.callback('😰 Stress & Anxiety', 'health_stress_anxiety')
  ],
  [
    Markup.button.callback('🏠 Back to Main Menu', 'back_to_main_menu')
  ]
]);

export const healingMenuKeyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback('🔄 Another Healing Tip', 'healingtip_another')
  ],
  [
    Markup.button.callback('🏠 Back to Main Menu', 'back_to_main_menu')
  ]
]);

export const journalHistoryKeyboard = (page: number, totalPages: number, entries: any[]) => {
  const keyboard = entries.map(e => [
    Markup.button.callback(`View (${new Date(e.entry_date).toLocaleDateString()})`, `journal_view_${e.id}`)
  ]);
  // Pagination controls
  if (totalPages > 1) {
    const navRow = [];
    if (page > 1) navRow.push(Markup.button.callback('⬅️ Prev', `journal_history_${page - 1}`));
    if (page < totalPages) navRow.push(Markup.button.callback('Next ➡️', `journal_history_${page + 1}`));
    keyboard.push(navRow);
  }
  keyboard.push([Markup.button.callback('📝 Add Entry', 'menu_journal')]);
  keyboard.push([Markup.button.callback('🏠 Back to Main Menu', 'back_to_main_menu')]);
  return Markup.inlineKeyboard(keyboard);
};

export const onboardingLearnMoreKeyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback('🚀 Yes, I\'m Ready!', 'onboarding_ready')
  ]
]);

export const settingsLanguageKeyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback('🇬🇧 English', 'set_language_en'),
    Markup.button.callback('🇫🇷 Français', 'set_language_fr')
  ],
  [
    Markup.button.callback('🇸🇦 العربية', 'set_language_ar'),
    Markup.button.callback('🇰🇪 Kiswahili', 'set_language_sw')
  ],
  [
    Markup.button.callback('⬅️ Back', 'menu_settings')
  ]
]);

export const settingsReminderTimeKeyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback('06:00', 'set_reminder_time_06:00'),
    Markup.button.callback('07:00', 'set_reminder_time_07:00'),
    Markup.button.callback('08:00', 'set_reminder_time_08:00')
  ],
  [
    Markup.button.callback('09:00', 'set_reminder_time_09:00'),
    Markup.button.callback('10:00', 'set_reminder_time_10:00')
  ],
  [
    Markup.button.callback('Custom Time', 'set_reminder_time_custom')
  ],
  [
    Markup.button.callback('⬅️ Back', 'menu_settings')
  ]
]);

export const settingsTipIntervalKeyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback('Daily', 'set_tip_interval_daily'),
    Markup.button.callback('Every 2 days', 'set_tip_interval_2d'),
    Markup.button.callback('Weekly', 'set_tip_interval_weekly')
  ],
  [
    Markup.button.callback('Custom Interval', 'set_tip_interval_custom')
  ],
  [
    Markup.button.callback('⬅️ Back', 'menu_settings')
  ]
]);

export const journalEditCancelKeyboard = Markup.inlineKeyboard([
  [Markup.button.callback('❌ Cancel Edit', 'cancel_journal_edit')],
  [Markup.button.callback('🏠 Back to Main Menu', 'back_to_main_menu')]
]);

export const journalDeleteConfirmKeyboard = (entryId: number) => Markup.inlineKeyboard([
  [
    Markup.button.callback('Yes, delete', `journal_delete_confirm_${entryId}`),
    Markup.button.callback('Back', 'journal_history_1')
  ]
]);

export const journalDeleteBackKeyboard = Markup.inlineKeyboard([
  [Markup.button.callback('Back', 'journal_history_1')],
  [Markup.button.callback('🏠 Back to Main Menu', 'back_to_main_menu')]
]);

export const backToSettingsKeyboard = Markup.inlineKeyboard([
  [Markup.button.callback('⬅️ Back to Settings', 'menu_settings')]
]);

export const cancelCustomInputKeyboard = Markup.inlineKeyboard([
  [Markup.button.callback('❌ Cancel', 'cancel_custom_input'), Markup.button.callback('⬅️ Back', 'settings_reminder_time')]
]);

export const cancelCustomTipInputKeyboard = Markup.inlineKeyboard([
  [Markup.button.callback('❌ Cancel', 'cancel_custom_input'), Markup.button.callback('⬅️ Back', 'settings_tip_interval')]
]);

export const onboardingReadyKeyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback('🚀 Yes, I\'m Ready!', 'onboarding_ready'),
    Markup.button.callback('ℹ️ Learn More', 'onboarding_learn_more')
  ]
]);

export const healingPlanPaginationKeyboard = (pageNum: number, totalPages: number) => {
  const navRow = [];
  if (pageNum > 1) navRow.push(Markup.button.callback('⬅️ Prev', `healingplan_page_${pageNum - 1}`));
  if (pageNum < totalPages) navRow.push(Markup.button.callback('Next ➡️', `healingplan_page_${pageNum + 1}`));
  return Markup.inlineKeyboard([
    navRow,
    [Markup.button.callback('🏠 Back to Main Menu', 'back_to_main_menu')]
  ]);
};

