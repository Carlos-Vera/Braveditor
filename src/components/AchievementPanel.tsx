import { useState } from 'react'
import type { AchievementProgress, AchievementCategory, UserStats, StreakState } from '../types/gamification'
import { ACHIEVEMENT_DEFS } from '../utils/achievementDefs'
import { getLevelTitle } from '../utils/gamification'
import { StreakCalendar } from './StreakCalendar'

type AchievementPanelProps = {
  achievements: AchievementProgress[]
  stats: UserStats
  streak: StreakState
  onClose: () => void
  onToggleEnabled: () => void
  enabled: boolean
}

const CATEGORIES: { key: AchievementCategory | 'levels'; label: string }[] = [
  { key: 'writing', label: 'Escritura' },
  { key: 'markdown', label: 'Markdown' },
  { key: 'productivity', label: 'Productividad' },
  { key: 'special', label: 'Especial' },
  { key: 'levels', label: 'Niveles' },
]

const LEVEL_RANGES = [
  { range: '1-49', title: 'Aprendiz', icon: '📝', color: '#8b8b8b' },
  { range: '50-129', title: 'Escritor', icon: '✏️', color: '#4a9eff' },
  { range: '130-249', title: 'Autor', icon: '📖', color: '#9b59b6' },
  { range: '250-599', title: 'Maestro', icon: '🏆', color: '#f39c12' },
  { range: '600-1499', title: 'Leyenda', icon: '⭐', color: '#e74c3c' },
  { range: '1500+', title: 'Gran Maestro', icon: '👑', color: '#c0392b' },
]

const btnStyle: React.CSSProperties = {
  background: 'var(--bg-tertiary)',
  color: 'var(--text)',
  border: '1px solid var(--border)',
  borderRadius: 4,
  padding: '6px 10px',
  cursor: 'pointer',
  fontSize: 13,
  fontWeight: 500,
}

export function AchievementPanel({ achievements, stats, streak, onClose, onToggleEnabled, enabled }: AchievementPanelProps) {
  const [activeTab, setActiveTab] = useState<AchievementCategory | 'levels'>('writing')

  const filteredDefs = ACHIEVEMENT_DEFS.filter((d) => d.category === activeTab)

  const getProgress = (id: string): AchievementProgress => {
    return achievements.find((a) => a.id === id) ?? { id, current: 0, unlocked: false }
  }

  const unlockedCount = achievements.filter((a) => a.unlocked).length

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--bg-primary)',
          border: '1px solid var(--border)',
          borderRadius: 8,
          padding: '24px 32px',
          maxWidth: 700,
          width: '95vw',
          maxHeight: '90vh',
          overflow: 'auto',
          color: 'var(--text)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 22 }}>
            🏆 Logros ({unlockedCount}/{ACHIEVEMENT_DEFS.length})
          </h2>
          <button type="button" style={{ ...btnStyle, fontSize: 18, padding: '4px 12px' }} onClick={onClose}>
            ✕
          </button>
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
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Nivel</div>
            <div style={{ fontWeight: 600 }}>
              {stats.level} - {getLevelTitle(stats.level)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>XP Total</div>
            <div style={{ fontWeight: 600 }}>{stats.totalXP.toLocaleString()}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Palabras</div>
            <div style={{ fontWeight: 600 }}>{stats.totalWordsWritten.toLocaleString()}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Guardados</div>
            <div style={{ fontWeight: 600 }}>{stats.totalDocsSaved}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Racha</div>
            <div style={{ fontWeight: 600 }}>🔥 {streak.currentStreak} (Máx: {streak.longestStreak})</div>
          </div>
        </div>

        {/* Streak Calendar */}
        <div style={{ marginBottom: 20 }}>
          <StreakCalendar days={streak.days} />
        </div>

        {/* Category tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              type="button"
              style={{
                ...btnStyle,
                background: activeTab === cat.key ? '#01b7af' : 'var(--bg-tertiary)',
                color: activeTab === cat.key ? '#000' : 'var(--text)',
                fontWeight: activeTab === cat.key ? 700 : 500,
              }}
              onClick={() => setActiveTab(cat.key)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Achievement list or Level ranges */}
        {activeTab === 'levels' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {LEVEL_RANGES.map((levelRange, idx) => {
              const isCurrentRange = getLevelTitle(stats.level) === levelRange.title
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
                        {isCurrentRange ? `✓ Nivel ${stats.level}` : `Niveles ${levelRange.range}`}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      Niveles {levelRange.range}
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
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Sistema de gamificación</span>
          <button
            type="button"
            style={{
              ...btnStyle,
              background: enabled ? '#01b7af' : 'var(--bg-tertiary)',
              color: enabled ? '#000' : 'var(--text)',
            }}
            onClick={onToggleEnabled}
          >
            {enabled ? 'Activado' : 'Desactivado'}
          </button>
        </div>
      </div>
    </div>
  )
}
