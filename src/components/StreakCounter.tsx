import { Badge, HoverCard, Progress } from '@radix-ui/themes'
import { t } from '../i18n'

type StreakCounterProps = {
  currentStreak: number
  multiplier: number
  todayQualified: boolean
}

type StreakTier = { fromDay: number; multiplier: number }

// Tramos del multiplicador de racha. Fuente de verdad: getStreakMultiplier() en utils/gamification.ts
// ponytail: literal de 3 tramos; si cambian los umbrales allí, actualízalos aquí.
const STREAK_TIERS: StreakTier[] = [
  { fromDay: 0, multiplier: 1 },
  { fromDay: 3, multiplier: 1.5 },
  { fromDay: 7, multiplier: 2 },
]

function formatMultiplier(value: number): string {
  return `x${value}`
}

export function StreakCounter({ currentStreak, multiplier, todayQualified }: StreakCounterProps) {
  const tiers = STREAK_TIERS
  const tierIndex = tiers.findIndex((_tier, i) => {
    const next = tiers[i + 1]
    return next ? currentStreak < next.fromDay : true
  })
  const currentTier = tiers[tierIndex] ?? tiers[0]
  const nextTier = tiers[tierIndex + 1]

  const progressPct = nextTier
    ? Math.min(((currentStreak - currentTier.fromDay) / (nextTier.fromDay - currentTier.fromDay)) * 100, 100)
    : 100

  const daysToNext = nextTier ? nextTier.fromDay - currentStreak : 0

  return (
    <HoverCard.Root>
      <HoverCard.Trigger>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            fontSize: 12,
            fontWeight: 600,
            color: 'rgba(0, 0, 0, 0.85)',
            lineHeight: 1,
            cursor: 'default',
            background: 'rgba(0, 0, 0, 0.14)',
            border: '1px solid rgba(0, 0, 0, 0.12)',
            borderRadius: 999,
            padding: '4px 10px',
          }}
        >
          {todayQualified && (
            <span style={{ color: '#0d0d0d', fontWeight: 800, fontSize: 13 }} aria-label={t('streakTodayCompletedAria')}>
              ✓
            </span>
          )}
          <span
            aria-hidden
            style={{ fontSize: 14, filter: 'drop-shadow(0 0 4px rgba(255, 122, 0, 0.5))' }}
          >
            🔥
          </span>
          <span style={{ fontWeight: 700 }}>{currentStreak}</span>
          <Badge
            size="1"
            style={{
              background: 'rgba(0, 0, 0, 0.6)',
              color: 'var(--brave-cyan)',
              fontWeight: 700,
              lineHeight: 1,
              borderRadius: 999,
              padding: '2px 7px',
            }}
          >
            {formatMultiplier(multiplier)}
          </Badge>
        </div>
      </HoverCard.Trigger>

      <HoverCard.Content maxWidth="330px" style={{ padding: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Cabecera */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              aria-hidden
              style={{ fontSize: 28, lineHeight: 1, filter: 'drop-shadow(0 0 8px rgba(255, 122, 0, 0.55))' }}
            >
              🔥
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.1 }}>
                {t('streakCounterLabel')} {currentStreak} {currentStreak !== 1 ? t('days') : t('day')}
              </span>
              <span style={{ fontSize: 11, color: 'var(--gray-a10)' }}>{t('streakKeepGoingHint')}</span>
            </div>
          </div>

          {/* Multiplicador */}
          <div
            style={{
              background: 'var(--gray-a3)',
              border: '1px solid var(--gray-a4)',
              borderRadius: 10,
              padding: '10px 12px',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, letterSpacing: 0.6, textTransform: 'uppercase', color: 'var(--gray-a10)' }}>
                {t('streakMultiplierLabel')}
              </span>
              <Badge size="2" variant="solid" color="cyan">
                {formatMultiplier(currentTier.multiplier)}
              </Badge>
            </div>
            {nextTier ? (
              <>
                <Progress value={progressPct} size="2" color="cyan" />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--gray-a10)' }}>
                  <span>{formatMultiplier(currentTier.multiplier)}</span>
                  <span>
                    {daysToNext} {daysToNext !== 1 ? t('days') : t('day')} {t('streakForWord')} {formatMultiplier(nextTier.multiplier)}
                  </span>
                  <span>{formatMultiplier(nextTier.multiplier)}</span>
                </div>
              </>
            ) : (
              <div style={{ fontSize: 12, color: 'var(--gray-a11)' }}>{t('streakMaxMultiplierReached')}</div>
            )}
          </div>

          {/* Tramos como fichas */}
          <div style={{ display: 'flex', gap: 8 }}>
            {tiers.map((tier, i) => {
              const next = tiers[i + 1]
              const rangeLabel = next ? `${tier.fromDay}–${next.fromDay - 1} ${t('days')}` : `${tier.fromDay}+ ${t('days')}`
              const isActive = tier === currentTier
              return (
                <div
                  key={tier.fromDay}
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    borderRadius: 8,
                    padding: '8px 4px',
                    background: isActive ? 'var(--brave-cyan)' : 'var(--gray-a3)',
                    color: isActive ? '#0d0d0d' : 'var(--gray-a11)',
                    border: isActive ? '1px solid var(--brave-cyan)' : '1px solid var(--gray-a4)',
                    boxShadow: isActive ? '0 0 10px rgba(1, 183, 175, 0.35)' : 'none',
                  }}
                >
                  <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.2 }}>
                    {formatMultiplier(tier.multiplier)}
                  </div>
                  <div style={{ fontSize: 10, opacity: isActive ? 0.75 : 0.8 }}>{rangeLabel}</div>
                </div>
              )
            })}
          </div>
        </div>
      </HoverCard.Content>
    </HoverCard.Root>
  )
}
