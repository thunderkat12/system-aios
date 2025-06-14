
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff } from 'lucide-react';
import { userLoginSchema } from '@/lib/validation';
import { useToast } from '@/hooks/use-toast';

interface LoginFormProps {
  onSubmit: (email: string, senha: string) => Promise<void>;
  onGoogleLogin: () => Promise<void>;
  isLoading: boolean;
}

export function LoginForm({ onSubmit, onGoogleLogin, isLoading }: LoginFormProps) {
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
    <div className="space-y-4">
      {/* Google Login Button */}
      <Button
        type="button"
        variant="outline"
        className="w-full flex items-center gap-2"
        onClick={onGoogleLogin}
        disabled={isLoading}
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        {isLoading ? "Entrando..." : "Entrar com Google"}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">ou</span>
        </div>
      </div>

      {/* Email/Password Form */}
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
    </div>
  );
}
