import type { GamificationState, StreakState } from '../types/gamification'

const STORAGE_KEY = 'braveditor-gamification'

// Nivel mínimo de cada rango: única fuente de verdad de los cortes de nivel
export const LEVEL_TIERS = [
  { min: 1, title: 'Aprendiz' },
  { min: 50, title: 'Escritor' },
  { min: 130, title: 'Autor' },
  { min: 250, title: 'Maestro' },
  { min: 600, title: 'Leyenda' },
  { min: 1500, title: 'Gran Maestro' },
] as const

export function getLevelTitle(level: number): string {
  let title: string = LEVEL_TIERS[0].title
  for (const tier of LEVEL_TIERS) if (level >= tier.min) title = tier.title
  return title
}

export function xpForLevel(level: number): number {
  return Math.floor(40 * Math.pow(1.05, level - 1))
}

export function xpInCurrentLevel(totalXP: number): { level: number; current: number; needed: number } {
  let level = 1
  let needed = xpForLevel(level)
  let remaining = totalXP
  while (remaining >= needed) {
    remaining -= needed
    level++
    needed = xpForLevel(level)
  }
  return { level, current: remaining, needed }
}

export function computeLevel(totalXP: number): number {
  return xpInCurrentLevel(totalXP).level
}

// YYYY-MM-DD en hora local ('en-CA' usa ese formato; toISOString sería UTC)
export function todayStr(): string {
  return new Date().toLocaleDateString('en-CA')
}

export function getStreakMultiplier(streak: number): number {
  if (streak >= 7) return 2.0
  if (streak >= 3) return 1.5
  return 1.0
}

export function createDefaultState(): GamificationState {
  return {
    enabled: true,
    stats: {
      totalWordsWritten: 0,
      totalTimeActiveMs: 0,
      totalDocsSaved: 0,
      totalFormatsUsed: {},
      totalXP: 0,
    },
    achievements: [],
    streak: {
      currentStreak: 0,
      longestStreak: 0,
      days: [],
    },
  }
}

function isValidGamificationState(obj: unknown): obj is GamificationState {
  if (!obj || typeof obj !== 'object') return false
  const state = obj as Partial<GamificationState>

  if (typeof state.enabled !== 'boolean') return false
  if (!state.stats || typeof state.stats !== 'object') return false
  if (!Array.isArray(state.achievements)) return false
  if (!state.streak || typeof state.streak !== 'object') return false

  const stats = state.stats as Record<string, unknown>
  const numericFields = ['totalWordsWritten', 'totalTimeActiveMs', 'totalDocsSaved', 'totalXP']
  if (numericFields.some((f) => typeof stats[f] !== 'number')) return false
  if (!stats.totalFormatsUsed || typeof stats.totalFormatsUsed !== 'object') return false

  return true
}

export function loadGamificationState(): GamificationState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (isValidGamificationState(parsed)) {
        return parsed
      }
      if (import.meta.env.DEV) {
        console.warn('Invalid gamification state in localStorage, using defaults')
      }
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Error loading gamification state:', error)
    }
  }
  return createDefaultState()
}

export function saveGamificationState(state: GamificationState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Error saving gamification state:', error)
    }
  }
}

export function updateStreakForToday(streak: StreakState, wordsAdded: number): StreakState {
  const today = todayStr()
  const days = [...streak.days]

  const todayIdx = days.findIndex((d) => d.date === today)
  if (todayIdx >= 0) {
    days[todayIdx] = {
      ...days[todayIdx],
      wordsWritten: days[todayIdx].wordsWritten + wordsAdded,
      qualified: days[todayIdx].wordsWritten + wordsAdded >= 50,
    }
  } else {
    days.push({ date: today, wordsWritten: wordsAdded, qualified: wordsAdded >= 50 })
  }

  // Keep only last 30 days
  while (days.length > 30) days.shift()

  // Recalculate streak
  let currentStreak = 0
  const sorted = [...days].sort((a, b) => b.date.localeCompare(a.date))
  for (const day of sorted) {
    if (!day.qualified) break
    const expectedDate = new Date()
    expectedDate.setDate(expectedDate.getDate() - currentStreak)
    if (day.date !== expectedDate.toLocaleDateString('en-CA')) break
    currentStreak++
  }

  return {
    currentStreak,
    longestStreak: Math.max(streak.longestStreak, currentStreak),
    days,
  }
}
