import { useState } from 'react'
import { Dialog, Tabs } from '@radix-ui/themes'
import type { AchievementProgress, AchievementCategory, UserStats, StreakState } from '../types/gamification'
import { ACHIEVEMENT_DEFS } from '../utils/achievementDefs'
import { getLevelTitle, computeLevel, LEVEL_TIERS } from '../utils/gamification'
import { StreakCalendar } from './StreakCalendar'
import { t } from '../i18n'

type AchievementPanelProps = {
  achievements: AchievementProgress[]
  stats: UserStats
  streak: StreakState
  onClose: () => void
  onToggleEnabled: () => void
  enabled: boolean
}

const CATEGORIES: { key: AchievementCategory | 'levels'; label: string }[] = [
  { key: 'writing', label: t('achCategoryWriting') },
  { key: 'markdown', label: t('achCategoryMarkdown') },
  { key: 'productivity', label: t('achCategoryProductivity') },
  { key: 'special', label: t('achCategorySpecial') },
  { key: 'levels', label: t('achCategoryLevels') },
]

// Icono/color por rango; los umbrales viven en LEVEL_TIERS (única fuente).
// Claves calculadas con t() para que coincidan con los títulos traducidos de LEVEL_TIERS.
const TIER_STYLE: Record<string, { icon: string; color: string }> = {
  [t('levelApprentice')]: { icon: '📝', color: '#8b8b8b' },
  [t('levelWriter')]: { icon: '✏️', color: '#4a9eff' },
  [t('levelAuthor')]: { icon: '📖', color: '#9b59b6' },
  [t('levelMaster')]: { icon: '🏆', color: '#f39c12' },
  [t('levelLegend')]: { icon: '⭐', color: '#e74c3c' },
  [t('levelGrandMaster')]: { icon: '👑', color: '#c0392b' },
}

const LEVEL_RANGES = LEVEL_TIERS.map((tier, i) => {
  const next = LEVEL_TIERS[i + 1]
  return {
    ...tier,
    ...TIER_STYLE[tier.title],
    range: next ? `${tier.min}-${next.min - 1}` : `${tier.min}+`,
  }
})

export function AchievementPanel({ achievements, stats, streak, onClose, onToggleEnabled, enabled }: AchievementPanelProps) {
  const [activeTab, setActiveTab] = useState<AchievementCategory | 'levels'>('writing')

  const level = computeLevel(stats.totalXP)
  const filteredDefs = ACHIEVEMENT_DEFS.filter((d) => d.category === activeTab)

  const getProgress = (id: string): AchievementProgress => {
    return achievements.find((a) => a.id === id) ?? { id, current: 0, unlocked: false }
  }

  const unlockedCount = ACHIEVEMENT_DEFS.filter((d) => getProgress(d.id).unlocked).length

  return (
    <Dialog.Root open onOpenChange={(open) => { if (!open) onClose() }}>
      <Dialog.Content
        maxWidth="700px"
        width="95vw"
        aria-describedby={undefined}
        style={{ maxHeight: '90vh', overflow: 'auto' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <Dialog.Title style={{ margin: 0, fontSize: 22 }}>
            🏆 {t('achDialogTitle')} ({unlockedCount}/{ACHIEVEMENT_DEFS.length})
          </Dialog.Title>
          <Dialog.Close>
            <button type="button" className="btn" style={{ fontSize: 18, padding: '4px 12px' }}>
              ✕
            </button>
          </Dialog.Close>
        </div>

        {/* Stats summary */}
        <div
          style={{
            display: 'flex',
            gap: 16,
            marginBottom: 20,
            flexWrap: 'wrap',
            padding: 12,
            background: 'var(--bg-secondary)',
            borderRadius: 6,
          }}
        >
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t('achLevelWord')}</div>
            <div style={{ fontWeight: 600 }}>
              {level} - {getLevelTitle(level)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t('achStatXpTotal')}</div>
            <div style={{ fontWeight: 600 }}>{stats.totalXP.toLocaleString()}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t('achStatWords')}</div>
            <div style={{ fontWeight: 600 }}>{stats.totalWordsWritten.toLocaleString()}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t('achStatSaved')}</div>
            <div style={{ fontWeight: 600 }}>{stats.totalDocsSaved}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t('achStatStreak')}</div>
            <div style={{ fontWeight: 600 }}>🔥 {streak.currentStreak} ({t('achMaxLabel')} {streak.longestStreak})</div>
          </div>
        </div>

        {/* Streak Calendar */}
        <div style={{ marginBottom: 20 }}>
          <StreakCalendar days={streak.days} />
        </div>

        {/* Category tabs */}
        <Tabs.Root
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as AchievementCategory | 'levels')}
        >
          <Tabs.List style={{ marginBottom: 16 }}>
            {CATEGORIES.map((cat) => (
              <Tabs.Trigger key={cat.key} value={cat.key}>
                {cat.label}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
        </Tabs.Root>

        {/* Achievement list or Level ranges */}
        {activeTab === 'levels' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {LEVEL_RANGES.map((levelRange, idx) => {
              const isCurrentRange = getLevelTitle(level) === levelRange.title
              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 12px',
                    background: 'var(--bg-secondary)',
                    borderRadius: 6,
                    opacity: isCurrentRange ? 1 : 0.7,
                    border: '1px solid var(--border)',
                    ...(isCurrentRange && {
                      boxShadow: '0 0 0 1px #01b7af',
                    }),
                  }}
                >
                  <span style={{ fontSize: 24 }}>{levelRange.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>{levelRange.title}</span>
                      <span style={{ fontSize: 11, color: isCurrentRange ? '#01b7af' : 'var(--text-muted)' }}>
                        {isCurrentRange ? `✓ ${t('achLevelWord')} ${level}` : `${t('achCategoryLevels')} ${levelRange.range}`}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {t('achCategoryLevels')} {levelRange.range}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filteredDefs.map((def) => {
              const progress = getProgress(def.id)
              const pct = Math.min((progress.current / def.target) * 100, 100)
              return (
                <div
                  key={def.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 12px',
                    background: 'var(--bg-secondary)',
                    borderRadius: 6,
                    opacity: progress.unlocked ? 1 : 0.7,
                    border: '1px solid var(--border)',
                    ...(progress.unlocked && {
                      boxShadow: '0 0 0 1px #01b7af',
                    }),
                  }}
                >
                  <span style={{ fontSize: 24 }}>{def.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>{def.name}</span>
                      <span style={{ fontSize: 11, color: progress.unlocked ? '#01b7af' : 'var(--text-muted)' }}>
                        {progress.unlocked ? `✓ +${def.xpReward} XP` : `${progress.current}/${def.target}`}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>{def.description}</div>
                    {!progress.unlocked && (
                      <div
                        style={{
                          width: '100%',
                          height: 4,
                          background: 'rgba(0,0,0,0.3)',
                          borderRadius: 2,
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${pct}%`,
                            height: '100%',
                            background: 'rgba(255,255,255,0.2)',
                            borderRadius: 2,
                            transition: 'width 0.3s ease',
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Toggle */}
        <div
          style={{
            marginTop: 20,
            paddingTop: 16,
            borderTop: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{t('achGamificationSystemLabel')}</span>
          <button
            type="button"
            className="btn"
            style={enabled ? { background: '#01b7af', color: '#000' } : undefined}
            onClick={onToggleEnabled}
          >
            {enabled ? t('achEnabledLabel') : t('achDisabledLabel')}
          </button>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}
