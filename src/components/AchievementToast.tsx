import { useEffect } from 'react'
import type { PendingToast } from '../types/gamification'

type AchievementToastProps = {
  toasts: PendingToast[]
  onDismiss: (id: string) => void
}

export function AchievementToast({ toasts, onDismiss }: AchievementToastProps) {
  if (toasts.length === 0) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 40,
        right: 20,
        zIndex: 2000,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  )
}

function ToastItem({ toast, onDismiss }: { toast: PendingToast; onDismiss: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 3000)
    return () => clearTimeout(timer)
  }, [toast.id, onDismiss])

  return (
    <div
      className="achievement-toast"
      style={{
        background: 'var(--bg-secondary)',
        border: '1px solid #01b7af',
        borderRadius: 8,
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        minWidth: 250,
        cursor: 'pointer',
        color: 'var(--text)',
      }}
      onClick={() => onDismiss(toast.id)}
    >
      <span style={{ fontSize: 24 }}>{toast.achievement.icon}</span>
      <div>
        <div style={{ fontWeight: 600, fontSize: 13 }}>{toast.achievement.name}</div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
          +{toast.achievement.xpReward} XP
        </div>
      </div>
    </div>
  )
}
