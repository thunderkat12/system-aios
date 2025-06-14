
import { useAuth } from '@/hooks/useAuth';

export function useAuthForms(onAuthSuccess: () => void) {
  const { signIn, signUp, signInWithGoogle, isLoading } = useAuth();

  const handleLogin = async (email: string, senha: string) => {
    const result = await signIn(email, senha);
    if (result.success) {
      onAuthSuccess();
    }
  };

  const handleGoogleLogin = async () => {
    const result = await signInWithGoogle();
    if (result.success) {
      onAuthSuccess();
    }
  };

  const handleRegister = async (dados: {
    nome_completo: string;
    email: string;
    senha: string;
    cargo: 'admin' | 'tecnico' | 'atendente';
  }) => {
    const result = await signUp(dados.email, dados.senha, dados.nome_completo, dados.cargo);
    if (result.success) {
      // Form will be reset by the RegisterForm component
    }
  };

  return {
    handleLogin,
    handleGoogleLogin,
    handleRegister,
    isLoading
  };
}
