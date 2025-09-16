import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useTasksStore } from '@/src/store/tasks.store';
import { useSessionsStore } from '@/src/store/sessions.store';
import { useSettingsStore } from '@/src/store/settings.store';
import { useAuth, AuthProvider } from '../hooks/useAuth';

// Esta função irá retornar a estrutura de navegação do seu app.
function AppContent() {
  const { user } = useAuth();
  const { loadTasks } = useTasksStore();
  const { loadSessions } = useSessionsStore();
  const { loadSettings } = useSettingsStore();

  useEffect(() => {
    // Inicializa as stores
    const initializeApp = async () => {
      await loadSettings();
      await loadTasks();
      await loadSessions();
    };
    initializeApp();
  }, [loadSettings, loadTasks, loadSessions]);

  return (
  <Stack>
    {!user
      ? [
          <Stack.Screen
            key="login"
            name="Login"
          />,
          <Stack.Screen
            key="cadastro"
            name="Cadastro"
          />,
        ]
      : (
          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false }}
          />
        )}
  </Stack>
);
}

// O componente de layout principal que usa o AuthProvider para o estado de login.
export default function AppLayout() {
  useFrameworkReady();

  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
