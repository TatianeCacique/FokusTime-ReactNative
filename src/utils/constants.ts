export const STORAGE_KEYS = {
  TASKS: '@pomodoro_tasks',
  SESSIONS: '@pomodoro_sessions',
  SETTINGS: '@pomodoro_settings',
  TIMER_STATE: '@pomodoro_timer_state',
} as const;

export const DEFAULT_SETTINGS = {
  focusMin: 25,
  shortBreakMin: 5,
  longBreakMin: 15,
  cyclesUntilLongBreak: 4,
  sound: true,
  vibration: true,
  theme: 'system' as const,
  locale: 'pt-BR' as const,
};

export const PRIORITY_COLORS = {
  low: '#22C55E',
  medium: '#F59E0B',
  high: '#EF4444',
} as const;

export const TIMER_COLORS = {
  focus: '#DC2626',
  shortBreak: '#16A34A',
  longBreak: '#2563EB',
} as const;