
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Users, Plus, Trash2, Edit } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { userRegisterSchema } from '@/lib/validation';

interface Usuario {
  id: string;
  nome_completo: string;
  email: string;
  cargo: 'admin' | 'tecnico' | 'atendente';
  ativo: boolean;
  created_at: string;
}

// Enhanced sanitization function with stricter security
const sanitizeString = (input: string): string => {
  return input.trim().replace(/[<>\"'&]/g, '').slice(0, 1000);
};

const sanitizeEmail = (email: string): string => {
  return email.toLowerCase().trim().replace(/[<>\"'&]/g, '');
};

export function UserManagement() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);
  const [formData, setFormData] = useState({
    nome_completo: '',
    email: '',
    senha: '',
    cargo: '' as 'admin' | 'tecnico' | 'atendente'
  });

  const { toast } = useToast();
  const { userProfile, signUp } = useAuth();

  useEffect(() => {
    loadUsuarios();
  }, []);

  const loadUsuarios = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      const usuariosTyped: Usuario[] = (data || []).map(user => ({
        ...user,
        cargo: user.cargo as 'admin' | 'tecnico' | 'atendente'
      }));

      setUsuarios(usuariosTyped);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao carregar lista de usuários",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.cargo) {
      toast({
        title: "Erro",
        description: "Selecione um cargo para o usuário",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingUser) {
        // Update existing user in our usuarios table
        const updateData: any = {
          nome_completo: sanitizeString(formData.nome_completo),
          email: sanitizeEmail(formData.email),
          cargo: formData.cargo,
        };

        const { error } = await supabase
          .from('usuarios')
          .update(updateData)
          .eq('id', editingUser.id);

        if (error) {
          if (error.code === '23505') {
            throw new Error('Este email já está cadastrado');
          }
          throw error;
        }

        toast({
          title: "Sucesso",
          description: "Usuário atualizado com sucesso",
        });
      } else {
        // Validate input for new user
        userRegisterSchema.parse(formData);

        // Create new user using Supabase Auth
        const result = await signUp(
          sanitizeEmail(formData.email),
          formData.senha,
          sanitizeString(formData.nome_completo),
          formData.cargo
        );

        if (!result.success) {
          throw new Error(result.error || 'Erro ao criar usuário');
        }

        toast({
          title: "Sucesso",
          description: "Usuário criado com sucesso. Verifique o email para ativação.",
        });
      }

      setIsDialogOpen(false);
      setEditingUser(null);
      setFormData({ nome_completo: '', email: '', senha: '', cargo: '' as any });
      loadUsuarios();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao salvar usuário",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (usuario: Usuario) => {
    if (usuario.id === userProfile?.id) {
      toast({
        title: "Erro",
        description: "Você não pode excluir sua própria conta",
        variant: "destructive",
      });
      return;
    }

    try {
      // Only deactivate user instead of deleting to maintain data integrity
      const { error } = await supabase
        .from('usuarios')
        .update({ ativo: false })
        .eq('id', usuario.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Sucesso",
        description: "Usuário desativado com sucesso",
      });

      loadUsuarios();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao desativar usuário",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (usuario: Usuario) => {
    setEditingUser(usuario);
    setFormData({
      nome_completo: usuario.nome_completo,
      email: usuario.email,
      senha: '',
      cargo: usuario.cargo
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingUser(null);
    setFormData({ nome_completo: '', email: '', senha: '', cargo: '' as any });
    setIsDialogOpen(true);
  };

  const getCargoLabel = (cargo: string) => {
    switch (cargo) {
      case 'admin': return 'Administrador';
      case 'tecnico': return 'Técnico';
      case 'atendente': return 'Atendente';
      default: return cargo;
    }
  };

  const getCargoColor = (cargo: string) => {
    switch (cargo) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'tecnico': return 'bg-blue-100 text-blue-800';
      case 'atendente': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Gestão de Usuários</h1>
          <p className="text-muted-foreground">
            Gerencie funcionários e permissões do sistema
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSaveUser} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo</Label>
                <Input
                  id="nome"
                  value={formData.nome_completo}
                  onChange={(e) => setFormData(prev => ({ ...prev, nome_completo: e.target.value }))}
                  required
                  maxLength={100}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                  maxLength={254}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="senha">
                  {editingUser ? 'Nova Senha (deixe em branco para manter)' : 'Senha'}
                </Label>
                <Input
                  id="senha"
                  type="password"
                  value={formData.senha}
                  onChange={(e) => setFormData(prev => ({ ...prev, senha: e.target.value }))}
                  required={!editingUser}
                  minLength={6}
                  maxLength={128}
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cargo">Cargo</Label>
                <Select value={formData.cargo} onValueChange={(value: 'admin' | 'tecnico' | 'atendente') => 
                  setFormData(prev => ({ ...prev, cargo: value }))}>
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
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingUser ? 'Atualizar' : 'Criar'} Usuário
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Usuários Cadastrados
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Carregando usuários...</p>
            </div>
          ) : usuarios.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum usuário cadastrado</p>
            </div>
          ) : (
            <div className="space-y-4">
              {usuarios.map((usuario) => (
                <div key={usuario.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div>
                        <h3 className="font-medium">{usuario.nome_completo}</h3>
                        <p className="text-sm text-muted-foreground">{usuario.email}</p>
                      </div>
                      <Badge className={getCargoColor(usuario.cargo)}>
                        {getCargoLabel(usuario.cargo)}
                      </Badge>
                      {!usuario.ativo && (
                        <Badge variant="secondary">Inativo</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditDialog(usuario)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {usuario.id !== userProfile?.id && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar desativação</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja desativar o usuário {usuario.nome_completo}? 
                              O usuário não poderá mais acessar o sistema.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteUser(usuario)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Desativar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
