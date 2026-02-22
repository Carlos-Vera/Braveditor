type StreakCounterProps = {
  currentStreak: number
  multiplier: number
  todayQualified: boolean
}

export function StreakCounter({ currentStreak, multiplier, todayQualified }: StreakCounterProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        fontSize: 13,
        fontWeight: 500,
        color: 'var(--text)',
      }}
      title={`Racha: ${currentStreak} día${currentStreak !== 1 ? 's' : ''} | Multiplicador: x${multiplier}`}
    >
      <span style={{ fontSize: 16 }}>🔥</span>
      <span>{currentStreak}</span>
      {multiplier > 1 && (
        <span style={{ fontSize: 11, color: '#01b7af', fontWeight: 600 }}>x{multiplier}</span>
      )}
      {todayQualified && (
        <span style={{ fontSize: 12, color: '#22c55e' }}>✓</span>
      )}
    </div>
  )
}
