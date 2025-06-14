
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { userLoginSchema } from '@/lib/validation';
import { useToast } from '@/hooks/use-toast';

interface LoginFormProps {
  onSubmit: (email: string, senha: string) => Promise<void>;
  isLoading: boolean;
}

export function LoginForm({ onSubmit, isLoading }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; senha?: string }>({});
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    try {
      // Validate input before submitting
      userLoginSchema.parse({ email, senha });
      await onSubmit(email, senha);
    } catch (error: any) {
      if (error.errors) {
        // Zod validation errors
        const fieldErrors: { email?: string; senha?: string } = {};
        error.errors.forEach((err: any) => {
          if (err.path[0] === 'email') {
            fieldErrors.email = err.message;
          } else if (err.path[0] === 'senha') {
            fieldErrors.senha = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        toast({
          title: "Erro no login",
          description: "Verifique suas credenciais e tente novamente",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="login-email">Email</Label>
        <Input
          id="login-email"
          type="email"
          placeholder="Digite seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
          className={errors.email ? "border-red-500" : ""}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="login-password">Senha</Label>
        <div className="relative">
          <Input
            id="login-password"
            type={showPassword ? "text" : "password"}
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            disabled={isLoading}
            minLength={6}
            className={errors.senha ? "border-red-500" : ""}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </div>
        {errors.senha && (
          <p className="text-sm text-red-500">{errors.senha}</p>
        )}
      </div>
      <Button type="submit" className="w-full" disabled={isLoading || !email || !senha}>
        {isLoading ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
}
