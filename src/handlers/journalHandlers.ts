
import { bot } from '../services/botService';
import { findOrCreateUser } from '../services/mockUserService';
import { listJournalEntries, getJournalEntryById, updateJournalEntryById, saveJournalEntry, deleteJournalEntryById } from '../services/mockServices';
import { setUserState, clearUserState, UserState } from '../services/stateService';
import { mainMenuKeyboard, journalMenuKeyboard, journalEditCancelKeyboard, journalDeleteConfirmKeyboard, journalDeleteBackKeyboard, journalHistoryKeyboard } from './ui';
import { Markup } from 'telegraf';
import { t, supportedLangs, SupportedLang } from '../utils/i18n';
import { handleError, handleBotError } from '../utils/errorHandler';

// Journal: Menu handler
bot.action('menu_journal', async (ctx) => {
  try {
    await ctx.editMessageText(
      '📝 **Journal Menu**\n\nWhat would you like to do with your journal?',
      { 
        parse_mode: 'Markdown', 
        reply_markup: journalMenuKeyboard.reply_markup 
      }
    );
    await ctx.answerCbQuery('Journal menu loaded');
  } catch (error) {
    handleBotError(ctx, error);
  }
});

const affirmations = [
  '🌅 Every reflection is a step toward healing. Keep going! 🕯️',
  '💡 Your thoughts matter. Journaling is self-care.',
  '🌿 Healing is a journey, not a destination. You are making progress.',
  '🕯️ Ibn Sina: "The knowledge of anything, since all things have causes, is not acquired or complete unless it is known by its causes."',
  '✨ Small steps every day lead to big changes.'
];

function getStreakMessage(streak: number): string | null {
  if (streak === 3) return '🔥 Awesome! You’re on a 3-day streak! Keep it up!';
  if (streak === 7) return '🏅 Impressive! You’ve hit a 7-day streak! You’ve earned a “Consistency” badge!';
  if (streak === 14) return '🥇 Outstanding! 14 days in a row! You’re a healing hero!';
  if (streak === 21) return '🏆 Incredible! 21-day streak! You’ve completed the full healing journey!';
  if (streak > 1) return `✨ You’re on a ${streak}-day streak! Every day counts.`;
  return null;
}

// Journal: Show history (paginated)
bot.action(/^journal_history(?:_(\d+))?$/, async (ctx) => {
  try {
    const user = await findOrCreateUser(ctx.from);
    const page = ctx.match?.[1] ? parseInt(ctx.match[1], 10) : 1;
    const pageSize = 5;
    const { entries, total } = await listJournalEntries(user, page, pageSize);
    const totalPages = Math.ceil(total / pageSize);
    if (entries.length === 0) {
      await ctx.editMessageText('No journal entries found.', { parse_mode: 'Markdown', reply_markup: journalMenuKeyboard.reply_markup });
      return;
    }
    const entryList = entries.map(e => `🗓️ ${e.entry_date.toLocaleDateString()}\n${e.entry_text?.slice(0, 40) || ''}...`).join('\n\n');
    await ctx.editMessageText(`📖 **Your Journal History**\n\n${entryList}`, { parse_mode: 'Markdown', reply_markup: journalHistoryKeyboard(page, totalPages, entries).reply_markup });
    await ctx.answerCbQuery();
  } catch (error) {
    handleBotError(ctx, error);
  }
});

// Journal: View entry
bot.action(/^journal_view_(\d+)$/, async (ctx) => {
  try {
    const user = await findOrCreateUser(ctx.from);
    const entryId = parseInt(ctx.match?.[1], 10);
    if (isNaN(entryId)) {
      handleBotError(ctx, 'Invalid entry ID.');
      return;
    }
    const entry = await getJournalEntryById(user, entryId);
    if (!entry) {
      await ctx.answerCbQuery('Entry not found.');
      return;
    }
    await ctx.editMessageText(`🗓️ ${new Date(entry.entry_date).toLocaleDateString()}\n\n${entry.entry_text || ''}`, { parse_mode: 'Markdown', reply_markup: Markup.inlineKeyboard([
        [Markup.button.callback('✏️ Edit', `journal_edit_${entry.id}`), Markup.button.callback('🗑️ Delete', `journal_delete_${entry.id}`)],
        [Markup.button.callback('⬅️ Back to History', 'journal_history_1')],
        [Markup.button.callback('🏠 Back to Main Menu', 'back_to_main_menu')]
      ]).reply_markup });
    await ctx.answerCbQuery();
  } catch (error) {
    handleBotError(ctx, error);
  }
});

// Journal: Edit entry (start editing)
bot.action(/^journal_edit_(\d+)$/, async (ctx) => {
  try {
    const entryId = parseInt(ctx.match?.[1], 10);
    if (isNaN(entryId)) {
      handleBotError(ctx, 'Invalid entry ID.');
      return;
    }
    const userId = ctx.from?.id;
    if (!userId) return;
    setUserState(userId, UserState.AWAITING_JOURNAL_EDIT, entryId);
    await ctx.editMessageText('✏️ Please send the new text for your journal entry.\n\n❌ To cancel, type "cancel"', { parse_mode: 'Markdown', reply_markup: journalEditCancelKeyboard.reply_markup });
    await ctx.answerCbQuery();
  } catch (error) {
    handleBotError(ctx, error);
  }
});

// Journal: Delete entry (confirmation)
bot.action(/^journal_delete_(\d+)$/, async (ctx) => {
  try {
    const entryId = parseInt(ctx.match?.[1], 10);
    if (isNaN(entryId)) {
      handleBotError(ctx, 'Invalid entry ID.');
      return;
    }
    const user = (await findOrCreateUser(ctx.from));
    let lang: SupportedLang = 'en';
    if (supportedLangs.includes(user['language_preference'] as SupportedLang)) {
      lang = user['language_preference'] as SupportedLang;
    }
    await ctx.editMessageText('Are you sure you want to delete this entry?', { parse_mode: 'Markdown', reply_markup: journalDeleteConfirmKeyboard(entryId).reply_markup });
    await ctx.answerCbQuery();
  } catch (error) {
    handleBotError(ctx, error);
  }
});

// Journal: Delete entry (confirmed)
bot.action(/^journal_delete_confirm_(\d+)$/, async (ctx) => {
  try {
    const user = (await findOrCreateUser(ctx.from));
    let lang: SupportedLang = 'en';
    if (supportedLangs.includes(user['language_preference'] as SupportedLang)) {
      lang = user['language_preference'] as SupportedLang;
    }
    const entryId = parseInt(ctx.match?.[1], 10);
    if (isNaN(entryId)) {
      handleBotError(ctx, 'Invalid entry ID.');
      return;
    }
    const success = await deleteJournalEntryById(user, entryId);
    if (success) {
      await ctx.editMessageText('Entry deleted.', { parse_mode: 'Markdown', reply_markup: journalDeleteBackKeyboard.reply_markup });
    } else {
      await ctx.editMessageText('Could not delete entry.', { parse_mode: 'Markdown', reply_markup: journalDeleteBackKeyboard.reply_markup });
    }
    await ctx.answerCbQuery();
  } catch (error) {
    handleBotError(ctx, error);
  }
});

bot.action('cancel_journal', async (ctx) => {
  try {
    const userId = ctx.from?.id;
    if (!userId) return;
    
    clearUserState(userId);
    
    const user = await findOrCreateUser(ctx.from);
    await ctx.editMessageText('🏠 Main Menu', { parse_mode: 'Markdown', reply_markup: mainMenuKeyboard.reply_markup });
    await ctx.answerCbQuery();
  } catch (error) {
    handleBotError(ctx, error);
  }
});

bot.action('cancel_journal_edit', async (ctx) => {
  try {
    const userId = ctx.from?.id;
    if (!userId) return;
    
    clearUserState(userId);
    
    const user = await findOrCreateUser(ctx.from);
    await ctx.editMessageText('🏠 Main Menu', { parse_mode: 'Markdown', reply_markup: mainMenuKeyboard.reply_markup });
    await ctx.answerCbQuery();
  } catch (error) {
    handleBotError(ctx, error);
  }
});
