import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator, Text } from 'react-native';

export function LoginRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redireciona para a tela de login após um breve delay
    const timer = setTimeout(() => {
      router.replace('/Login');
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#DC2626" />
      <Text style={{ marginTop: 12, color: '#6B7280' }}>Redirecionando...</Text>
    </View>
  );
}