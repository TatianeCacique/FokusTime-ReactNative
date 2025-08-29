import { useEffect } from 'react';
import { useTimerStore } from '@/src/store/timer.store';
import { useSettingsStore } from '@/src/store/settings.store';
import { AppState } from 'react-native';

export const useTimer = () => {
  const timer = useTimerStore();
  const { loadSettings } = useSettingsStore();

  useEffect(() => {
    // Load settings and timer state on mount
    const initialize = async () => {
      await loadSettings();
      await timer.loadTimerState();
    };

    initialize();

    // Handle app state changes
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active') {
        // App resumed, recalculate timer
        timer.loadTimerState();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      timer.stopInterval();
      subscription?.remove();
    };
  }, []);

  return timer;
};