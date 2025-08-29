import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useTasksStore } from '@/src/store/tasks.store';
import { useSessionsStore } from '@/src/store/sessions.store';
import { useSettingsStore } from '@/src/store/settings.store';

export default function RootLayout() {
  useFrameworkReady();

  const { loadTasks } = useTasksStore();
  const { loadSessions } = useSessionsStore();
  const { loadSettings } = useSettingsStore();

  useEffect(() => {
    // Initialize stores
    const initializeApp = async () => {
      await loadSettings();
      await loadTasks();
      await loadSessions();
    };

    initializeApp();
  }, []);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}