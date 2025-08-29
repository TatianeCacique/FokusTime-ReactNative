import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useTimerStore } from '@/src/store/timer.store';
import { useSettingsStore } from '@/src/store/settings.store';
import { formatTime, minutesToSeconds } from '@/src/utils/time';
import { TIMER_COLORS } from '@/src/utils/constants';
import { t } from '@/src/i18n';

export const PomodoroProgress: React.FC = () => {
  const { currentType, timeLeft } = useTimerStore();
  const { settings } = useSettingsStore();

  const progress = useSharedValue(0);

  const totalDuration = React.useMemo(() => {
    const durations = {
      focus: settings.focusMin,
      shortBreak: settings.shortBreakMin,
      longBreak: settings.longBreakMin,
    };
    return minutesToSeconds(durations[currentType]);
  }, [currentType, settings]);

  React.useEffect(() => {
    const progressValue = totalDuration > 0 ? (totalDuration - timeLeft) / totalDuration : 0;
    progress.value = withTiming(progressValue, { duration: 1000 });
  }, [timeLeft, totalDuration]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${progress.value * 360}deg` }],
    };
  });

  const currentColor = TIMER_COLORS[currentType];

  return (
    <View style={styles.container}>
      <View style={[styles.circle, { borderColor: currentColor }]}>
        <View style={[styles.progressTrack, { borderColor: `${currentColor}20` }]}>
          <Animated.View 
            style={[
              styles.progressFill, 
              { borderColor: currentColor },
              animatedStyle
            ]} 
          />
        </View>
        
        <View style={styles.content}>
          <Text style={[styles.timeText, { color: currentColor }]}>
            {formatTime(timeLeft)}
          </Text>
          <Text style={styles.typeText}>
            {t(currentType, settings.locale)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 32,
  },
  circle: {
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 8,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressTrack: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 8,
  },
  progressFill: {
    position: 'absolute',
    width: 120,
    height: 240,
    borderTopRightRadius: 120,
    borderBottomRightRadius: 120,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderBottomWidth: 8,
    right: 120,
  },
  content: {
    alignItems: 'center',
  },
  timeText: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  typeText: {
    fontSize: 18,
    color: '#6B7280',
    textTransform: 'capitalize',
  }
});