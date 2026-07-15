import type { AchievementDef } from '../types/gamification'
import { t } from '../i18n'

export const ACHIEVEMENT_DEFS: AchievementDef[] = [
  // Writing
  { id: 'first-words', name: t('achFirstWordsName'), description: t('achFirstWordsDesc'), icon: '✏️', category: 'writing', target: 200, xpReward: 100 },
  { id: 'wordsmith', name: t('achWordsmithName'), description: t('achWordsmithDesc'), icon: '📝', category: 'writing', target: 1000, xpReward: 200 },
  { id: 'novelist', name: t('achNovelistName'), description: t('achNovelistDesc'), icon: '📖', category: 'writing', target: 5000, xpReward: 500 },
  { id: 'prolific', name: t('achProlificName'), description: t('achProlificDesc'), icon: '🏆', category: 'writing', target: 10000, xpReward: 1000 },
  { id: 'marathon', name: t('achMarathonName'), description: t('achMarathonDesc'), icon: '🏅', category: 'writing', target: 20000, xpReward: 2000 },

  // Markdown
  { id: 'bold-move', name: t('achBoldMoveName'), description: t('achBoldMoveDesc'), icon: '🅱️', category: 'markdown', target: 20, xpReward: 100 },
  { id: 'heading-master', name: t('achHeadingMasterName'), description: t('achHeadingMasterDesc'), icon: '📋', category: 'markdown', target: 40, xpReward: 200 },
  { id: 'link-builder', name: t('achLinkBuilderName'), description: t('achLinkBuilderDesc'), icon: '🔗', category: 'markdown', target: 30, xpReward: 200 },
  { id: 'code-ninja', name: t('achCodeNinjaName'), description: t('achCodeNinjaDesc'), icon: '💻', category: 'markdown', target: 20, xpReward: 200 },
  { id: 'list-lover', name: t('achListLoverName'), description: t('achListLoverDesc'), icon: '📃', category: 'markdown', target: 40, xpReward: 200 },
  { id: 'format-explorer', name: t('achFormatExplorerName'), description: t('achFormatExplorerDesc'), icon: '🎨', category: 'markdown', target: 10, xpReward: 300 },

  // Productivity
  { id: 'first-save', name: t('achFirstSaveName'), description: t('achFirstSaveDesc'), icon: '💾', category: 'productivity', target: 1, xpReward: 100 },
  { id: 'saver', name: t('achSaverName'), description: t('achSaverDesc'), icon: '🗄️', category: 'productivity', target: 20, xpReward: 400 },
  { id: 'time-10', name: t('achTime10Name'), description: t('achTime10Desc'), icon: '⏱️', category: 'productivity', target: 1200000, xpReward: 100 },
  { id: 'time-60', name: t('achTime60Name'), description: t('achTime60Desc'), icon: '🕐', category: 'productivity', target: 7200000, xpReward: 400 },
  { id: 'streak-3', name: t('achStreak3Name'), description: t('achStreak3Desc'), icon: '🔥', category: 'productivity', target: 6, xpReward: 300 },
  { id: 'streak-7', name: t('achStreak7Name'), description: t('achStreak7Desc'), icon: '🔥', category: 'productivity', target: 14, xpReward: 1000 },

  // Special
  { id: 'brave-ace', name: t('achBraveAceName'), description: t('achBraveAceDesc'), icon: '🚀', category: 'special', target: 1, xpReward: 2000 },
]
