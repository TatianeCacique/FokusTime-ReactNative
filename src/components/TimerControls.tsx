import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Play, Pause, RotateCcw } from 'lucide-react-native';
import { useTimerStore } from '@/src/store/timer.store';
import { useSettingsStore } from '@/src/store/settings.store';
import { t } from '@/src/i18n';

export const TimerControls: React.FC = () => {
  const { isRunning, isPaused, startTimer, pauseTimer, resumeTimer, resetTimer } = useTimerStore();
  const { settings } = useSettingsStore();

  const handleMainAction = () => {
    if (!isRunning) {
      startTimer();
    } else if (isPaused) {
      resumeTimer();
    } else {
      pauseTimer();
    }
  };

  const getMainButtonText = () => {
    if (!isRunning) return t('start', settings.locale);
    if (isPaused) return t('resume', settings.locale);
    return t('pause', settings.locale);
  };

  const getMainButtonIcon = () => {
    if (!isRunning || isPaused) {
      return <Play size={24} color="white" />;
    }
    return <Pause size={24} color="white" />;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.mainButton, isRunning && !isPaused && styles.pauseButton]}
        onPress={handleMainAction}
        accessibilityLabel={getMainButtonText()}
        accessibilityRole="button"
        testID="timer-main-button"
      >
        {getMainButtonIcon()}
        <Text style={styles.mainButtonText}>{getMainButtonText()}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.resetButton}
        onPress={resetTimer}
        accessibilityLabel={t('reset', settings.locale)}
        accessibilityRole="button"
        testID="timer-reset-button"
      >
        <RotateCcw size={20} color="#6B7280" />
        <Text style={styles.resetButtonText}>{t('reset', settings.locale)}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 16,
  },
  mainButton: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  pauseButton: {
    backgroundColor: '#F59E0B',
  },
  mainButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  resetButtonText: {
    color: '#6B7280',
    fontSize: 16,
  },
});