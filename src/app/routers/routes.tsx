import { Stack } from 'expo-router';
import { ProtectedRoute } from './components/protected-route';

export function AppRoutes() {
  return (
    <Stack>
      {/* Rotas públicas */}
      <Stack.Screen 
        name="Login" 
        options={{ 
          headerShown: false,
          animation: 'fade'
        }} 
      />
      
      <Stack.Screen 
        name="Cadastro" 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right'
        }} 
      />

      {/* Rotas protegidas */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }}>
        {() => (
          <ProtectedRoute>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </ProtectedRoute>
        )}
      </Stack.Screen>

      <Stack.Screen name="AlterarDados" options={{ headerShown: false }}>
        {() => (
          <ProtectedRoute>
            <Stack.Screen name="AlterarDados" options={{ headerShown: false }} />
          </ProtectedRoute>
        )}
      </Stack.Screen>

      {/* Rota de fallback */}
      <Stack.Screen 
        name="index" 
        options={{ 
          headerShown: false,
          animation: 'fade'
        }} 
      />
    </Stack>
  );
}