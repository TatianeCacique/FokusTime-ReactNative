import { createContext, useContext, useState, useEffect } from 'react';
import { router, useSegments } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Estrutura do usuário
type User = {
  email: string;
  password: string;
};

type AuthContextType = {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  signIn: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }): React.ReactNode {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const segments = useSegments();

  // Login validando usuário
  const signIn = async (email: string, password: string) => {
    try {
      const storedUsers = await AsyncStorage.getItem('users');
      const users = storedUsers ? JSON.parse(storedUsers) : [];

      const user = users.find((u: any) => u.email === email && u.password === password);

      if (user) {
        setAuthUser(user);
        console.log("Usuário logado com sucesso!");
        router.replace('/(tabs)/timer');
      } else {
        alert("Email ou senha inválidos!");
      }
    } catch (error) {
      console.error("Erro ao realizar login:", error);
    }
  };

  // Logout
  const signOut = async () => {
    try {
      // Apenas "desloga", mas não apaga os usuários cadastrados
      setAuthUser(null);
      console.log("Usuário deslogado!");
      router.replace('/');
    } catch (error) {
      console.error("Erro ao deslogar:", error);
    }
  };

  // Carregar usuário salvo ao iniciar
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('currentUser');
        if (storedUser) {
          setAuthUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
      }
    };
    loadUser();
  }, []);

  // Sempre que o usuário mudar, salvar quem está logado
  useEffect(() => {
    const saveCurrentUser = async () => {
      if (authUser) {
        await AsyncStorage.setItem('currentUser', JSON.stringify(authUser));
      } else {
        await AsyncStorage.removeItem('currentUser');
      }
    };
    saveCurrentUser();
  }, [authUser]);

  // Redirecionamento automático
  useEffect(() => {
    const inAuthGroup = segments[0] === '(tabs)';
    if (typeof window !== 'undefined' && !(window as any).expoRouterReady) return;

    if (authUser && !inAuthGroup) {
      router.replace('/(tabs)/timer');
    } else if (!authUser && inAuthGroup) {
      router.replace('/');
    }
  }, [authUser, segments]);

  return (
    <AuthContext.Provider value={{ user: authUser, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export { AuthContext };
