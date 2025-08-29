import React, { useEffect } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { PomodoroProgress } from '@/src/components/PomodoroProgress';
import { TimerControls } from '@/src/components/TimerControls';
import { TaskSelector } from '@/src/components/TaskSelector';
import { useTimer } from '@/src/hooks/useTimer';
import { NotificationService } from '@/src/services/notifications';

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