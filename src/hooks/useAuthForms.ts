
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

export function useAuthForms(onAuthSuccess: () => void) {
  const { login, register, isLoading } = useSupabaseAuth();

  const handleLogin = async (email: string, senha: string) => {
    const result = await login(email, senha);
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
    const result = await register(dados);
    if (result.success) {
      // Form will be reset by the RegisterForm component
    }
  };

  return {
    handleLogin,
    handleRegister,
    isLoading
  };
}
