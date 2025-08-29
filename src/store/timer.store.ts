import { create } from 'zustand';
import { TimerState } from '@/src/types';
import { StorageService } from '@/src/services/storage';
import { NotificationService } from '@/src/services/notifications';
import { useSettingsStore } from './settings.store';
import { useSessionsStore } from './sessions.store';
import { useTasksStore } from './tasks.store';
import { minutesToSeconds } from '@/src/utils/time';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

interface TimerStore extends TimerState {
  notificationId?: string;
  intervalId?: NodeJS.Timeout;
  
  // Actions
  loadTimerState: () => Promise<void>;
  startTimer: () => Promise<void>;
  pauseTimer: () => Promise<void>;
  resumeTimer: () => Promise<void>;
  resetTimer: () => Promise<void>;
  completeSession: () => Promise<void>;
  setCurrentTask: (taskId: string | undefined) => Promise<void>;
  tick: () => void;
  calculateTimeLeft: () => number;
  startInterval: () => void;
  stopInterval: () => void;
}

export const useTimerStore = create<TimerStore>((set, get) => ({
  isRunning: false,
  isPaused: false,
  currentType: 'focus',
  timeLeft: minutesToSeconds(25), // Default 25 minutes
  currentTaskId: undefined,
  cycleCount: 0,
  notificationId: undefined,
  intervalId: undefined,

  loadTimerState: async () => {
    const savedState = await StorageService.getTimerState();
    const settings = useSettingsStore.getState().settings;

    if (savedState && savedState.startedAt) {
      // Calculate actual time left based on elapsed time
      const elapsed = Math.floor((Date.now() - new Date(savedState.startedAt).getTime()) / 1000);
      const timeLeft = Math.max(0, savedState.originalDuration - elapsed);
      
      set({
        ...savedState,
        timeLeft,
        isRunning: timeLeft > 0 && savedState.isRunning && !savedState.isPaused,
      });

      if (timeLeft <= 0 && savedState.isRunning) {
        // Session completed while app was closed
        get().completeSession();
      } else if (timeLeft > 0 && savedState.isRunning && !savedState.isPaused) {
        // Resume timer
        get().startInterval();
        
        // Schedule new notification for remaining time
        const notificationId = await NotificationService.scheduleTimerComplete(
          timeLeft,
          savedState.currentType
        );
        set({ notificationId });
      }
    } else {
      // Set default time based on current settings
      const defaultTime = minutesToSeconds(settings.focusMin);
      set({ timeLeft: defaultTime });
    }
  },

  startTimer: async () => {
    const state = get();
    const settings = useSettingsStore.getState().settings;
    
    if (state.isRunning) return;

    const startedAt = new Date().toISOString();
    const duration = state.timeLeft;

    // Schedule notification
    const notificationId = await NotificationService.scheduleTimerComplete(
      duration,
      state.currentType
    );

    set({
      isRunning: true,
      isPaused: false,
      startedAt,
      notificationId,
    });

    get().startInterval();

    // Save state for persistence
    await StorageService.saveTimerState({
      ...get(),
      originalDuration: duration,
    });
  },

  pauseTimer: async () => {
    const state = get();
    
    if (!state.isRunning || state.isPaused) return;

    // Cancel notification
    if (state.notificationId) {
      await NotificationService.cancelNotification(state.notificationId);
    }

    set({
      isPaused: true,
      notificationId: undefined,
    });

    get().stopInterval();

    // Save paused state
    await StorageService.saveTimerState(get());
  },

  resumeTimer: async () => {
    const state = get();
    
    if (!state.isRunning || !state.isPaused) return;

    const startedAt = new Date().toISOString();
    
    // Schedule new notification for remaining time
    const notificationId = await NotificationService.scheduleTimerComplete(
      state.timeLeft,
      state.currentType
    );

    set({
      isPaused: false,
      startedAt,
      notificationId,
    });

    get().startInterval();

    // Save resumed state
    await StorageService.saveTimerState({
      ...get(),
      originalDuration: state.timeLeft,
    });
  },

  resetTimer: async () => {
    const state = get();
    const settings = useSettingsStore.getState().settings;

    // Cancel any pending notification
    if (state.notificationId) {
      await NotificationService.cancelNotification(state.notificationId);
    }

    get().stopInterval();

    // Reset to default duration based on current type
    const defaultDurations = {
      focus: settings.focusMin,
      shortBreak: settings.shortBreakMin,
      longBreak: settings.longBreakMin,
    };

    set({
      isRunning: false,
      isPaused: false,
      timeLeft: minutesToSeconds(defaultDurations[state.currentType]),
      startedAt: undefined,
      notificationId: undefined,
    });

    // Clear saved state
    await StorageService.saveTimerState(null);
  },

  completeSession: async () => {
    const state = get();
    const settings = useSettingsStore.getState().settings;

    if (!state.startedAt) return;

    // Add session to history
    const session = {
      type: state.currentType,
      durationSec: state.currentType === 'focus' 
        ? minutesToSeconds(settings.focusMin)
        : state.currentType === 'shortBreak'
        ? minutesToSeconds(settings.shortBreakMin)
        : minutesToSeconds(settings.longBreakMin),
      startedAt: state.startedAt,
      endedAt: new Date().toISOString(),
      taskId: state.currentTaskId,
    };

    await useSessionsStore.getState().addSession(session);

    // Increment task pomodoros if it was a focus session
    if (state.currentType === 'focus' && state.currentTaskId) {
      await useTasksStore.getState().incrementPomodoros(state.currentTaskId);
    }

    // Haptic feedback
    if (Platform.OS !== 'web' && settings.vibration) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    // Determine next session type
    let nextType: 'focus' | 'shortBreak' | 'longBreak' = 'focus';
    let nextCycleCount = state.cycleCount;

    if (state.currentType === 'focus') {
      nextCycleCount += 1;
      nextType = nextCycleCount % settings.cyclesUntilLongBreak === 0 ? 'longBreak' : 'shortBreak';
    }

    const nextDurations = {
      focus: settings.focusMin,
      shortBreak: settings.shortBreakMin,
      longBreak: settings.longBreakMin,
    };

    get().stopInterval();

    set({
      isRunning: false,
      isPaused: false,
      currentType: nextType,
      timeLeft: minutesToSeconds(nextDurations[nextType]),
      startedAt: undefined,
      notificationId: undefined,
      cycleCount: nextCycleCount,
    });

    // Clear saved state
    await StorageService.saveTimerState(null);
  },

  setCurrentTask: async (taskId) => {
    set({ currentTaskId: taskId });
    await StorageService.saveTimerState(get());
  },

  tick: () => {
    const state = get();
    
    if (!state.isRunning || state.isPaused) return;

    const newTimeLeft = get().calculateTimeLeft();

    if (newTimeLeft <= 0) {
      get().completeSession();
    } else {
      set({ timeLeft: newTimeLeft });
    }
  },

  calculateTimeLeft: () => {
    const state = get();
    
    if (!state.startedAt) return state.timeLeft;

    const elapsed = Math.floor((Date.now() - new Date(state.startedAt).getTime()) / 1000);
    const settings = useSettingsStore.getState().settings;
    
    const totalDuration = state.currentType === 'focus' 
      ? minutesToSeconds(settings.focusMin)
      : state.currentType === 'shortBreak'
      ? minutesToSeconds(settings.shortBreakMin)
      : minutesToSeconds(settings.longBreakMin);

    return Math.max(0, totalDuration - elapsed);
  },

  startInterval: () => {
    get().stopInterval(); // Clear any existing interval
    
    const intervalId = setInterval(() => {
      get().tick();
    }, 1000);

    set({ intervalId });
  },

  stopInterval: () => {
    const state = get();
    if (state.intervalId) {
      clearInterval(state.intervalId);
      set({ intervalId: undefined });
    }
  },
}));