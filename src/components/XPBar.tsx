import { xpInCurrentLevel, getLevelTitle } from '../utils/gamification'

type XPBarProps = {
  totalXP: number
  level: number
  enabled: boolean
}

export function XPBar({ totalXP, level, enabled }: XPBarProps) {
  if (!enabled) return null

  const { current, needed } = xpInCurrentLevel(totalXP)
  const pct = Math.min((current / needed) * 100, 100)
  const title = getLevelTitle(level)

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
        Nv.{level} {title}
      </span>
      <div
        style={{
          width: 100,
          height: 8,
          background: 'rgba(255, 255, 255, 0.15)',
          borderRadius: 4,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          className="xp-bar-fill"
          style={{
            width: `${pct}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #01949c 0%, #027f86 100%)',
            borderRadius: 4,
            transition: 'width 0.3s ease',
            boxShadow: '0 0 8px rgba(1, 183, 175, 0.4)',
          }}
        />
      </div>
      <span style={{ fontSize: 11, whiteSpace: 'nowrap' }}>
        {current}/{needed} XP
      </span>
    </div>
  )
}
