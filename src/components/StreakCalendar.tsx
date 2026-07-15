import type { StreakDay } from '../types/gamification'
import { t } from '../i18n'

type StreakCalendarProps = {
  days: StreakDay[]
}

export function StreakCalendar({ days }: StreakCalendarProps) {
  // Build last 30 days grid
  const grid: { date: string; day?: StreakDay }[] = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateStr = d.toLocaleDateString('en-CA') // YYYY-MM-DD local, igual que todayStr()
    const match = days.find((dd) => dd.date === dateStr)
    grid.push({ date: dateStr, day: match })
  }

  return (
    <div>
      <h4 style={{ margin: '0 0 8px', fontSize: 13, color: 'var(--text-muted)' }}>
        {t('streakCalendarTitle')}
      </h4>
      <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {grid.map((cell) => {
          let bg = 'var(--bg-tertiary)'
          if (cell.day) {
            bg = cell.day.qualified ? '#01b7af' : 'rgba(1, 183, 175, 0.3)'
          }
          return (
            <div
              key={cell.date}
              title={`${cell.date}: ${cell.day ? `${cell.day.wordsWritten} ${t('words')}` : t('streakNoActivity')}`}
              style={{
                width: 14,
                height: 14,
                borderRadius: 2,
                background: bg,
              }}
            />
          )
        })}
      </div>
    </div>
  )
}
