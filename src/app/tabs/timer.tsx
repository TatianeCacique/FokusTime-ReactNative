import React, { useEffect } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { TimerControls } from '@/src/app/components/TimerControls';
import { TaskSelector } from '@/src/app/components/TaskSelector';
import { useTimer } from '@/src/app/hooks/useTimer';
import { NotificationService } from '@/src/app/components/notifications';
import { PomodoroProgress } from '../components/PomodoroProgress';

export default function TimerScreen() {
  const { isRunning } = useTimer();

  useEffect(() => {
    // Request notification permissions on mount
    NotificationService.requestPermissions();
  }, []);

  useEffect(() => {
    const manageKeepAwake = async () => {
      if (isRunning) {
        try {
          await activateKeepAwakeAsync();
        } catch (error) {
          console.warn('Keep awake activation error:', error);
        }
      } else {
        try {
          await deactivateKeepAwake();
        } catch (error) {
          console.warn('Keep awake deactivation error:', error);
        }
      }
    };

    manageKeepAwake();

    return () => {
      // Só tenta desativar se realmente estava ativo
      if (isRunning) {
        deactivateKeepAwake().catch(() => {
          // Ignora erros no cleanup
        });
      }
    };
  }, [isRunning]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <PomodoroProgress />
        <TaskSelector />
        <TimerControls />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
