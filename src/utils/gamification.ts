import type { GamificationState, UserStats, StreakState } from '../types/gamification'

const STORAGE_KEY = 'braveditor-gamification'

// Títulos de nivel según rangos
function getLevelTitleByRange(level: number): string {
  if (level >= 1500) return 'Gran Maestro'
  if (level >= 600) return 'Leyenda'
  if (level >= 250) return 'Maestro'
  if (level >= 130) return 'Autor'
  if (level >= 50) return 'Escritor'
  return 'Aprendiz' // Niveles 1-49
}

export function xpForLevel(level: number): number {
  return Math.floor(40 * Math.pow(1.05, level - 1))
}

export function computeLevel(totalXP: number): number {
  let level = 1
  let xpNeeded = xpForLevel(level)
  let remaining = totalXP
  while (remaining >= xpNeeded) {
    remaining -= xpNeeded
    level++
    xpNeeded = xpForLevel(level)
  }
  return level
}

export function xpInCurrentLevel(totalXP: number): { current: number; needed: number } {
  let level = 1
  let xpNeeded = xpForLevel(level)
  let remaining = totalXP
  while (remaining >= xpNeeded) {
    remaining -= xpNeeded
    level++
    xpNeeded = xpForLevel(level)
  }
  return { current: remaining, needed: xpNeeded }
}

export function getLevelTitle(level: number): string {
  return getLevelTitleByRange(level)
}

export function todayStr(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function daysBetween(a: string, b: string): number {
  const da = new Date(a + 'T00:00:00')
  const db = new Date(b + 'T00:00:00')
  return Math.round(Math.abs(db.getTime() - da.getTime()) / 86400000)
}

export function getStreakMultiplier(streak: number): number {
  if (streak >= 7) return 2.0
  if (streak >= 3) return 1.5
  if (streak >= 1) return 1.0
  return 1.0
}

function createDefaultFormats(): Record<string, number> {
  return {}
}

export function createDefaultState(): GamificationState {
  return {
    enabled: true,
    stats: {
      totalWordsWritten: 0,
      totalTimeActiveMs: 0,
      totalDocsSaved: 0,
      totalFormatsUsed: createDefaultFormats() as UserStats['totalFormatsUsed'],
      totalXP: 0,
      level: 1,
    },
    achievements: [],
    streak: {
      currentStreak: 0,
      longestStreak: 0,
      days: [],
    },
    version: 1,
  }
}

function isValidGamificationState(obj: unknown): obj is GamificationState {
  if (!obj || typeof obj !== 'object') return false
  const state = obj as Partial<GamificationState>

  // Validar campos obligatorios
  if (typeof state.enabled !== 'boolean') return false
  if (typeof state.version !== 'number') return false
  if (!state.stats || typeof state.stats !== 'object') return false
  if (!Array.isArray(state.achievements)) return false
  if (!state.streak || typeof state.streak !== 'object') return false

  // Validar stats
  const stats = state.stats as Partial<UserStats>
  if (typeof stats.totalWordsWritten !== 'number') return false
  if (typeof stats.totalTimeActiveMs !== 'number') return false
  if (typeof stats.totalDocsSaved !== 'number') return false
  if (typeof stats.totalXP !== 'number') return false
  if (typeof stats.level !== 'number') return false
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
    const serialized = JSON.stringify(state)

    // Validar tamaño (localStorage límite típico: 5-10MB)
    const sizeInBytes = new Blob([serialized]).size
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (sizeInBytes > maxSize) {
      if (import.meta.env.DEV) {
        console.warn(`Gamification state too large: ${(sizeInBytes / 1024 / 1024).toFixed(2)}MB`)
      }
      return
    }

    localStorage.setItem(STORAGE_KEY, serialized)
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
    const expected = `${expectedDate.getFullYear()}-${String(expectedDate.getMonth() + 1).padStart(2, '0')}-${String(expectedDate.getDate()).padStart(2, '0')}`
    if (day.date !== expected) break
    currentStreak++
  }

  return {
    currentStreak,
    longestStreak: Math.max(streak.longestStreak, currentStreak),
    days,
  }
}
