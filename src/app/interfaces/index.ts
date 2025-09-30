export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  done: boolean;
  pomodoros: number;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  id: string;
  type: 'focus' | 'shortBreak' | 'longBreak';
  durationSec: number;
  startedAt: string;
  endedAt: string;
  taskId?: string;
}

export interface Settings {
  focusMin: number;
  shortBreakMin: number;
  longBreakMin: number;
  cyclesUntilLongBreak: number;
  sound: boolean;
  vibration: boolean;
  theme: 'system' | 'light' | 'dark';
  locale: 'pt-BR' | 'en-US';
}

export interface TimerState {
  isRunning: boolean;
  isPaused: boolean;
  currentType: 'focus' | 'shortBreak' | 'longBreak';
  timeLeft: number; 
  startedAt?: string;
  currentTaskId?: string;
  cycleCount: number;
}

export type RootTabParamList = {
  Timer: undefined;
  Tasks: undefined;
  History: undefined;
  Settings: undefined;
};