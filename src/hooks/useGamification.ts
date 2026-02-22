import { useState, useCallback, useRef, useEffect } from 'react'
import type { GamificationState, PendingToast, AchievementProgress } from '../types/gamification'
import type { ToolbarAction } from '../types'
import { ACHIEVEMENT_DEFS } from '../utils/achievementDefs'
import {
  loadGamificationState,
  saveGamificationState,
  computeLevel,
  getStreakMultiplier,
  updateStreakForToday,
} from '../utils/gamification'

function getAchievementValue(state: GamificationState, id: string): number {
  const s = state.stats
  switch (id) {
    case 'first-words':
    case 'wordsmith':
    case 'novelist':
    case 'prolific':
    case 'marathon':
      return s.totalWordsWritten
    case 'bold-move':
      return (s.totalFormatsUsed['bold'] ?? 0)
    case 'heading-master':
      return (s.totalFormatsUsed['h1'] ?? 0) + (s.totalFormatsUsed['h2'] ?? 0) + (s.totalFormatsUsed['h3'] ?? 0)
    case 'link-builder':
      return (s.totalFormatsUsed['link'] ?? 0)
    case 'code-ninja':
      return (s.totalFormatsUsed['code'] ?? 0)
    case 'list-lover':
      return (s.totalFormatsUsed['ul'] ?? 0) + (s.totalFormatsUsed['ol'] ?? 0)
    case 'format-explorer': {
      let count = 0
      for (const key of Object.keys(s.totalFormatsUsed)) {
        if ((s.totalFormatsUsed as Record<string, number>)[key] > 0) count++
      }
      return count
    }
    case 'first-save':
    case 'saver':
      return s.totalDocsSaved
    case 'time-10':
    case 'time-60':
      return s.totalTimeActiveMs
    case 'streak-3':
    case 'streak-7':
      return state.streak.currentStreak
    case 'format-master': {
      // Cuenta cuántos formatos diferentes se han usado al menos una vez
      let count = 0
      for (const key of Object.keys(s.totalFormatsUsed)) {
        if ((s.totalFormatsUsed as Record<string, number>)[key] > 0) count++
      }
      return count
    }
    case 'perfectionist':
      // Por ahora retorna 0, necesita tracking de ediciones por documento
      return 0
    case 'brave-ace': {
      // Verifica si todos los otros logros están desbloqueados
      const allOtherAchievements = ACHIEVEMENT_DEFS.filter(a => a.id !== 'brave-ace')
      const unlockedCount = state.achievements.filter(a => a.id !== 'brave-ace' && a.unlocked).length
      return unlockedCount === allOtherAchievements.length ? 1 : 0
    }
    default:
      return 0
  }
}

function checkAchievements(state: GamificationState): { updatedAchievements: AchievementProgress[]; newlyUnlocked: string[]; xpGained: number } {
  const updatedAchievements = [...state.achievements]
  const newlyUnlocked: string[] = []
  let xpGained = 0

  for (const def of ACHIEVEMENT_DEFS) {
    const existing = updatedAchievements.find((a) => a.id === def.id)
    const value = getAchievementValue(state, def.id)

    if (existing) {
      if (!existing.unlocked && value >= def.target) {
        existing.current = value
        existing.unlocked = true
        existing.unlockedAt = new Date().toISOString()
        newlyUnlocked.push(def.id)
        xpGained += def.xpReward
      } else {
        existing.current = value
      }
    } else {
      const unlocked = value >= def.target
      const progress: AchievementProgress = {
        id: def.id,
        current: value,
        unlocked,
        ...(unlocked ? { unlockedAt: new Date().toISOString() } : {}),
      }
      updatedAchievements.push(progress)
      if (unlocked) {
        newlyUnlocked.push(def.id)
        xpGained += def.xpReward
      }
    }
  }

  return { updatedAchievements, newlyUnlocked, xpGained }
}

export function useGamification() {
  const [state, setState] = useState<GamificationState>(loadGamificationState)
  const [pendingToasts, setPendingToasts] = useState<PendingToast[]>([])
  const lastWordCountRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Persist on change
  useEffect(() => {
    saveGamificationState(state)
  }, [state])

  // Active time timer
  useEffect(() => {
    if (!state.enabled) return
    timerRef.current = setInterval(() => {
      setState((prev) => {
        const multiplier = getStreakMultiplier(prev.streak.currentStreak)
        const xpGain = Math.floor(5 * multiplier)
        const newStats = {
          ...prev.stats,
          totalTimeActiveMs: prev.stats.totalTimeActiveMs + 300000,
          totalXP: prev.stats.totalXP + xpGain,
          level: computeLevel(prev.stats.totalXP + xpGain),
        }
        const newState = { ...prev, stats: newStats }
        const { updatedAchievements, newlyUnlocked, xpGained } = checkAchievements(newState)
        if (xpGained > 0) {
          newState.stats = {
            ...newState.stats,
            totalXP: newState.stats.totalXP + xpGained,
            level: computeLevel(newState.stats.totalXP + xpGained),
          }
        }
        newState.achievements = updatedAchievements
        if (newlyUnlocked.length > 0) {
          const toasts = newlyUnlocked.map((id) => ({
            id: `${id}-${Date.now()}`,
            achievement: ACHIEVEMENT_DEFS.find((d) => d.id === id)!,
          }))
          setPendingToasts((prev) => [...prev, ...toasts])
        }
        return newState
      })
    }, 300000) // 5 minutes

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [state.enabled])

  const applyWithAchievements = useCallback((updater: (prev: GamificationState) => GamificationState) => {
    setState((prev) => {
      const updated = updater(prev)
      const { updatedAchievements, newlyUnlocked, xpGained } = checkAchievements(updated)
      const finalState = { ...updated, achievements: updatedAchievements }
      if (xpGained > 0) {
        finalState.stats = {
          ...finalState.stats,
          totalXP: finalState.stats.totalXP + xpGained,
          level: computeLevel(finalState.stats.totalXP + xpGained),
        }
      }
      if (newlyUnlocked.length > 0) {
        const toasts = newlyUnlocked.map((id) => ({
          id: `${id}-${Date.now()}`,
          achievement: ACHIEVEMENT_DEFS.find((d) => d.id === id)!,
        }))
        setPendingToasts((p) => [...p, ...toasts])
      }
      return finalState
    })
  }, [])

  const trackWords = useCallback(
    (currentWordCount: number) => {
      if (!state.enabled) return
      const delta = currentWordCount - lastWordCountRef.current
      lastWordCountRef.current = currentWordCount
      if (delta <= 0) return

      applyWithAchievements((prev) => {
        const multiplier = getStreakMultiplier(prev.streak.currentStreak)
        const xpGain = Math.floor((delta / 10) * multiplier)
        const newStats = {
          ...prev.stats,
          totalWordsWritten: prev.stats.totalWordsWritten + delta,
          totalXP: prev.stats.totalXP + xpGain,
          level: computeLevel(prev.stats.totalXP + xpGain),
        }
        const newStreak = updateStreakForToday(prev.streak, delta)
        return { ...prev, stats: newStats, streak: newStreak }
      })
    },
    [state.enabled, applyWithAchievements]
  )

  const trackFormat = useCallback(
    (action: ToolbarAction) => {
      if (!state.enabled) return
      applyWithAchievements((prev) => {
        const multiplier = getStreakMultiplier(prev.streak.currentStreak)
        const xpGain = Math.floor(10 * multiplier)
        const newFormats = { ...prev.stats.totalFormatsUsed }
        newFormats[action] = (newFormats[action] ?? 0) + 1
        const newStats = {
          ...prev.stats,
          totalFormatsUsed: newFormats,
          totalXP: prev.stats.totalXP + xpGain,
          level: computeLevel(prev.stats.totalXP + xpGain),
        }
        return { ...prev, stats: newStats }
      })
    },
    [state.enabled, applyWithAchievements]
  )

  const trackSave = useCallback(
    (wordCount: number) => {
      if (!state.enabled) return
      applyWithAchievements((prev) => {
        const multiplier = getStreakMultiplier(prev.streak.currentStreak)
        const baseXP = Math.floor((wordCount / 10) * 150)
        const xpGain = Math.floor(baseXP * multiplier)
        const newStats = {
          ...prev.stats,
          totalDocsSaved: prev.stats.totalDocsSaved + 1,
          totalXP: prev.stats.totalXP + xpGain,
          level: computeLevel(prev.stats.totalXP + xpGain),
        }
        return { ...prev, stats: newStats }
      })
    },
    [state.enabled, applyWithAchievements]
  )

  const toggleEnabled = useCallback(() => {
    setState((prev) => ({ ...prev, enabled: !prev.enabled }))
  }, [])

  const dismissToast = useCallback((id: string) => {
    setPendingToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return {
    state,
    pendingToasts,
    trackWords,
    trackFormat,
    trackSave,
    toggleEnabled,
    dismissToast,
  }
}
