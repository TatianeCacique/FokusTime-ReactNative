import { ReactNode } from 'react';
import { useAuth } from '@/src/app/hooks/useAuth';
import { LoginRedirect } from './login-redirect';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user } = useAuth();

  // Se não tem usuário, redireciona para login
  if (!user) {
    return <LoginRedirect />;
  }

  // Se tem usuário, renderiza o conteúdo
  return <>{children}</>;
}