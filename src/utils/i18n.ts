// Simple i18n utility for the bot

export type SupportedLang = 'en' | 'fr' | 'ar' | 'sw';
export const supportedLangs = ['en', 'fr', 'ar', 'sw'] as const;

type TranslationKey =
  | 'welcome'
  | 'main_menu'
  | 'checklist_complete'
  | 'streak_3'
  | 'streak_7'
  | 'streak_14'
  | 'streak_21'
  | 'streak_generic'
  | 'cancel'
  | 'cancelled'
  | 'edit_cancelled'
  | 'journal_entry_cancelled'
  | 'are_you_sure_delete'
  | 'yes_delete'
  | 'back'
  | 'entry_deleted'
  | 'could_not_delete';

type TranslationDict = Record<TranslationKey, string>;

const translations: Record<SupportedLang, TranslationDict> = {
  en: {
    welcome: 'Welcome to Hikma, {name}! Your Healing Journey Begins!',
    main_menu: '🏠 Main Menu',
    checklist_complete: '✅ Day {day}/21 complete!',
    streak_3: '🔥 Awesome! You’re on a 3-day streak! Keep it up!',
    streak_7: '🏅 Impressive! You’ve hit a 7-day streak! You’ve earned a “Consistency” badge!',
    streak_14: '🥇 Outstanding! 14 days in a row! You’re a healing hero!',
    streak_21: '🏆 Incredible! 21-day streak! You’ve completed the full healing journey!',
    streak_generic: '✨ You’re on a {streak}-day streak! Every day counts.',
    cancel: '❌ Cancel',
    cancelled: '❌ Cancelled.',
    edit_cancelled: '✏️ Edit cancelled. Returning to main menu.',
    journal_entry_cancelled: '📝 Journal entry cancelled. Returning to main menu.',
    are_you_sure_delete: '⚠️ Are you sure you want to delete this entry?',
    yes_delete: '✅ Yes, Delete',
    back: '⬅️ Back',
    entry_deleted: '✅ Entry deleted.',
    could_not_delete: '❌ Could not delete entry.',
  },
  fr: {
    welcome: 'Bienvenue à Hikma, {name} ! Votre parcours de guérison commence !',
    main_menu: '🏠 Menu Principal',
    checklist_complete: '✅ Jour {day}/21 terminé !',
    streak_3: '🔥 Génial ! Vous êtes sur une série de 3 jours ! Continuez !',
    streak_7: '🏅 Impressionnant ! Série de 7 jours ! Vous avez gagné le badge “Constante” !',
    streak_14: '🥇 Exceptionnel ! 14 jours d’affilée ! Vous êtes un héros de la guérison !',
    streak_21: '🏆 Incroyable ! 21 jours d’affilée ! Vous avez terminé le parcours complet !',
    streak_generic: '✨ Vous êtes sur une série de {streak} jours ! Chaque jour compte.',
    cancel: '❌ Annuler',
    cancelled: '❌ Annulé.',
    edit_cancelled: '✏️ Modification annulée. Retour au menu principal.',
    journal_entry_cancelled: '📝 Saisie du journal annulée. Retour au menu principal.',
    are_you_sure_delete: '⚠️ Êtes-vous sûr de vouloir supprimer cette entrée ?',
    yes_delete: '✅ Oui, supprimer',
    back: '⬅️ Retour',
    entry_deleted: '✅ Entrée supprimée.',
    could_not_delete: '❌ Impossible de supprimer l’entrée.',
  },
  ar: {
    welcome: 'مرحبًا بك في حكمة، {name}! تبدأ رحلتك العلاجية الآن!',
    main_menu: '🏠 القائمة الرئيسية',
    checklist_complete: '✅ اليوم {day}/21 اكتمل!',
    streak_3: '🔥 رائع! أنت على سلسلة 3 أيام! استمر!',
    streak_7: '🏅 مدهش! لقد وصلت إلى سلسلة 7 أيام! حصلت على شارة "الاستمرارية"!',
    streak_14: '🥇 مذهل! 14 يومًا على التوالي! أنت بطل الشفاء!',
    streak_21: '🏆 لا يصدق! سلسلة 21 يومًا! أكملت الرحلة العلاجية بالكامل!',
    streak_generic: '✨ أنت على سلسلة {streak} أيام! كل يوم مهم.',
    cancel: '❌ إلغاء',
    cancelled: '❌ تم الإلغاء.',
    edit_cancelled: '✏️ تم إلغاء التعديل. العودة إلى القائمة الرئيسية.',
    journal_entry_cancelled: '📝 تم إلغاء إدخال اليوميات. العودة إلى القائمة الرئيسية.',
    are_you_sure_delete: '⚠️ هل أنت متأكد أنك تريد حذف هذا الإدخال؟',
    yes_delete: '✅ نعم، احذف',
    back: '⬅️ رجوع',
    entry_deleted: '✅ تم حذف الإدخال.',
    could_not_delete: '❌ تعذر حذف الإدخال.',
  },
  sw: {
    welcome: 'Karibu Hikma, {name}! Safari yako ya uponyaji inaanza!',
    main_menu: '🏠 Menyu Kuu',
    checklist_complete: '✅ Siku ya {day}/21 imekamilika!',
    streak_3: '🔥 Safi sana! Uko kwenye mfululizo wa siku 3! Endelea hivyo!',
    streak_7: '🏅 Imara! Umefikia mfululizo wa siku 7! Umepata beji ya "Uthabiti"!',
    streak_14: '🥇 Bora! Siku 14 mfululizo! Wewe ni shujaa wa uponyaji!',
    streak_21: '🏆 Ajabu! Mfululizo wa siku 21! Umehitimisha safari kamili ya uponyaji!',
    streak_generic: '✨ Uko kwenye mfululizo wa siku {streak}! Kila siku ni muhimu.',
    cancel: '❌ Ghairi',
    cancelled: '❌ Imeghairiwa.',
    edit_cancelled: '✏️ Uhariri umeghairiwa. Kurudi kwenye menyu kuu.',
    journal_entry_cancelled: '📝 Uandishi wa jarida umeghairiwa. Kurudi kwenye menyu kuu.',
    are_you_sure_delete: '⚠️ Una uhakika unataka kufuta ingizo hili?',
    yes_delete: '✅ Ndiyo, Futa',
    back: '⬅️ Rudi',
    entry_deleted: '✅ Ingizo limefutwa.',
    could_not_delete: '❌ Imeshindikana kufuta ingizo.',
  },
};

export function t(
  lang: SupportedLang,
  key: TranslationKey,
  params?: Record<string, string | number>
) {
  const dict = translations[lang] || translations.en;
  let str = dict[key] || translations.en[key] || key;
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      str = str.replace(new RegExp(`{${k}}`, 'g'), String(v));
    });
  }
  return str;
}