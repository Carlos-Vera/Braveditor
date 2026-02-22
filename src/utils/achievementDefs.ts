import type { AchievementDef } from '../types/gamification'

export const ACHIEVEMENT_DEFS: AchievementDef[] = [
  // Writing
  { id: 'first-words', name: 'Primeras Palabras', description: 'Escribe tus primeras 200 palabras', icon: '✏️', category: 'writing', target: 200, xpReward: 100 },
  { id: 'wordsmith', name: 'Escritor', description: 'Escribe 1,000 palabras en total', icon: '📝', category: 'writing', target: 1000, xpReward: 200 },
  { id: 'novelist', name: 'Novelista', description: 'Escribe 5,000 palabras en total', icon: '📖', category: 'writing', target: 5000, xpReward: 500 },
  { id: 'prolific', name: 'Prolífico', description: 'Escribe 10,000 palabras en total', icon: '🏆', category: 'writing', target: 10000, xpReward: 1000 },
  { id: 'marathon', name: 'Maratonista', description: 'Escribe 20,000 palabras en total', icon: '🏅', category: 'writing', target: 20000, xpReward: 2000 },

  // Markdown
  { id: 'bold-move', name: 'Movimiento Audaz', description: 'Usa negrita 20 veces', icon: '🅱️', category: 'markdown', target: 20, xpReward: 100 },
  { id: 'heading-master', name: 'Maestro de Títulos', description: 'Usa encabezados 40 veces', icon: '📋', category: 'markdown', target: 40, xpReward: 200 },
  { id: 'link-builder', name: 'Constructor de Enlaces', description: 'Inserta 30 enlaces', icon: '🔗', category: 'markdown', target: 30, xpReward: 200 },
  { id: 'code-ninja', name: 'Ninja del Código', description: 'Usa bloques de código 20 veces', icon: '💻', category: 'markdown', target: 20, xpReward: 200 },
  { id: 'list-lover', name: 'Amante de Listas', description: 'Crea 40 listas', icon: '📃', category: 'markdown', target: 40, xpReward: 200 },
  { id: 'format-explorer', name: 'Explorador de Formato', description: 'Usa 10 tipos de formato diferentes', icon: '🎨', category: 'markdown', target: 10, xpReward: 300 },

  // Productivity
  { id: 'first-save', name: 'Primera Guardada', description: 'Guarda tu primer documento', icon: '💾', category: 'productivity', target: 1, xpReward: 100 },
  { id: 'saver', name: 'Guardián', description: 'Guarda 20 documentos', icon: '🗄️', category: 'productivity', target: 20, xpReward: 400 },
  { id: 'time-10', name: '20 Minutos', description: 'Pasa 20 minutos editando', icon: '⏱️', category: 'productivity', target: 1200000, xpReward: 100 },
  { id: 'time-60', name: '2 Horas', description: 'Pasa 2 horas editando', icon: '🕐', category: 'productivity', target: 7200000, xpReward: 400 },
  { id: 'streak-3', name: 'Racha de 6', description: 'Mantén una racha de 6 días', icon: '🔥', category: 'productivity', target: 6, xpReward: 300 },
  { id: 'streak-7', name: 'Racha de 14', description: 'Mantén una racha de 14 días', icon: '🔥', category: 'productivity', target: 14, xpReward: 1000 },

  // Special
  { id: 'format-master', name: 'Explorador', description: 'Usa todos los botones de formato', icon: '🎨', category: 'special', target: 10, xpReward: 300 },
  { id: 'perfectionist', name: 'Perfeccionista', description: 'Edita un documento más de 100 veces', icon: '🎯', category: 'special', target: 100, xpReward: 500 },
  { id: 'brave-ace', name: 'As de Braves', description: 'Consigue todos los logros', icon: '🚀', category: 'special', target: 1, xpReward: 2000 },
]
