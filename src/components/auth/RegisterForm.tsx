
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, EyeOff } from 'lucide-react';
import { userRegisterSchema } from '@/lib/validation';
import { useToast } from '@/hooks/use-toast';

interface RegisterData {
  nome_completo: string;
  email: string;
  senha: string;
  cargo: 'admin' | 'tecnico' | 'atendente' | '';
}

interface RegisterFormProps {
  onSubmit: (data: Omit<RegisterData, 'cargo'> & { cargo: 'admin' | 'tecnico' | 'atendente' }) => Promise<void>;
  isLoading: boolean;
}

export function RegisterForm({ onSubmit, isLoading }: RegisterFormProps) {
  const [formData, setFormData] = useState<RegisterData>({
    nome_completo: '',
    email: '',
    senha: '',
    cargo: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!formData.cargo) {
        toast({
          title: "Erro de validação",
          description: "Selecione um cargo",
          variant: "destructive",
        });
        return;
      }

      // Validate input before submitting
      userRegisterSchema.parse(formData);

      await onSubmit({
        ...formData,
        cargo: formData.cargo as 'admin' | 'tecnico' | 'atendente'
      });
      
      setFormData({ nome_completo: '', email: '', senha: '', cargo: '' });
    } catch (error: any) {
      if (error.errors) {
        // Zod validation error
        const firstError = error.errors[0];
        toast({
          title: "Erro de validação",
          description: firstError.message,
          variant: "destructive",
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="register-name">Nome Completo</Label>
        <Input
          id="register-name"
          placeholder="Digite o nome completo"
          value={formData.nome_completo}
          onChange={(e) => setFormData(prev => ({ ...prev, nome_completo: e.target.value }))}
          required
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="register-email">Email</Label>
        <Input
          id="register-email"
          type="email"
          placeholder="Digite o email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          required
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="register-password">Senha</Label>
        <div className="relative">
          <Input
            id="register-password"
            type={showPassword ? "text" : "password"}
            placeholder="Digite a senha"
            value={formData.senha}
            onChange={(e) => setFormData(prev => ({ ...prev, senha: e.target.value }))}
            required
            disabled={isLoading}
            minLength={6}
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
      </div>
      <div className="space-y-2">
        <Label htmlFor="register-cargo">Cargo</Label>
        <Select 
          value={formData.cargo} 
          onValueChange={(value: 'admin' | 'tecnico' | 'atendente') => 
            setFormData(prev => ({ ...prev, cargo: value }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o cargo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Administrador</SelectItem>
            <SelectItem value="tecnico">Técnico</SelectItem>
            <SelectItem value="atendente">Atendente</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading || !formData.cargo}>
        {isLoading ? "Cadastrando..." : "Cadastrar Usuário"}
      </Button>
    </form>
  );
}
