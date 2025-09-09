import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useTasksStore } from '@/src/store/tasks.store';
import { useSessionsStore } from '@/src/store/sessions.store';
import { useSettingsStore } from '@/src/store/settings.store';
import { useAuth, AuthProvider } from '../hooks/useAuth';
import { Timer } from 'lucide-react-native';
import { View, Text } from 'react-native';

// Esta função irá retornar a estrutura de navegação do seu app.
function AppContent() {
  const { user } = useAuth();
  const { loadTasks } = useTasksStore();
  const { loadSessions } = useSessionsStore();
  const { loadSettings } = useSettingsStore();

  // Bloqueio imediato antes de renderizar qualquer página protegida
  if (!user && window.location.pathname !== '/' && window.location.pathname !== '/Register') {
    window.location.replace('/');
    return null;
  }

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
    <>
      <Stack>
        {!user ? (
          <>
            <Stack.Screen
              name="Login"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Cadastro"
              options={{
                headerShown: false,
              }}
            />
          </>
        ) : (
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        )}
      </Stack>
      <StatusBar style="auto" />
    </>
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