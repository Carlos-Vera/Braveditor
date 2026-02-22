import type { ToolbarAction } from './index'

export type AchievementCategory = 'writing' | 'markdown' | 'productivity' | 'special'

export type AchievementDef = {
  id: string
  name: string
  description: string
  icon: string
  category: AchievementCategory
  target: number
  xpReward: number
}

export type AchievementProgress = {
  id: string
  current: number
  unlocked: boolean
  unlockedAt?: string
}

export type UserStats = {
  totalWordsWritten: number
  totalTimeActiveMs: number
  totalDocsSaved: number
  totalFormatsUsed: Record<ToolbarAction, number>
  totalXP: number
  level: number
}

export type StreakDay = {
  date: string
  wordsWritten: number
  qualified: boolean
}

export type StreakState = {
  currentStreak: number
  longestStreak: number
  days: StreakDay[]
}

export type PendingToast = {
  id: string
  achievement: AchievementDef
}

export type GamificationState = {
  enabled: boolean
  stats: UserStats
  achievements: AchievementProgress[]
  streak: StreakState
  version: number
}
