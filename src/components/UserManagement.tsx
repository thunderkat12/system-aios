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
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { userRegisterSchema } from '@/lib/validation';
import { hashPassword, sanitizeEmail, sanitizeString } from '@/lib/auth';

interface Usuario {
  id: string;
  nome_completo: string;
  email: string;
  cargo: 'admin' | 'tecnico' | 'atendente';
  ativo: boolean;
  created_at: string;
}

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
  const { user, logActivity } = useSupabaseAuth();

  useEffect(() => {
    loadUsuarios();
  }, []);

  const loadUsuarios = async () => {
    if (!user || user.cargo !== 'admin') {
      toast({
        title: "Acesso negado",
        description: "Apenas administradores podem gerenciar usuários",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar usuários:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar lista de usuários",
          variant: "destructive",
        });
        return;
      }

      const usuariosTyped: Usuario[] = (data || []).map(user => ({
        ...user,
        cargo: user.cargo as 'admin' | 'tecnico' | 'atendente'
      }));

      setUsuarios(usuariosTyped);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || user.cargo !== 'admin') {
      toast({
        title: "Acesso negado",
        description: "Apenas administradores podem gerenciar usuários",
        variant: "destructive",
      });
      return;
    }

    if (!formData.cargo) {
      toast({
        title: "Erro",
        description: "Selecione um cargo para o usuário",
        variant: "destructive",
      });
      return;
    }

    try {
      // Validate input
      const validationData = {
        nome_completo: formData.nome_completo,
        email: formData.email,
        senha: formData.senha,
        cargo: formData.cargo
      };

      if (editingUser && !formData.senha) {
        // For updates without password change, remove senha from validation
        delete (validationData as any).senha;
        userRegisterSchema.omit({ senha: true }).parse(validationData);
      } else {
        userRegisterSchema.parse(validationData);
      }

      // Sanitize inputs
      const sanitizedEmail = sanitizeEmail(formData.email);
      const sanitizedNome = sanitizeString(formData.nome_completo);

      if (editingUser) {
        // Atualizar usuário existente
        const updateData: any = {
          nome_completo: sanitizedNome,
          email: sanitizedEmail,
          cargo: formData.cargo,
        };

        if (formData.senha) {
          updateData.senha_hash = await hashPassword(formData.senha);
        }

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

        await logActivity('update_user', `Usuário ${sanitizedNome} foi atualizado`);
        
        toast({
          title: "Sucesso",
          description: "Usuário atualizado com sucesso",
        });
      } else {
        // Criar novo usuário
        const hashedPassword = await hashPassword(formData.senha);

        const { error } = await supabase
          .from('usuarios')
          .insert({
            nome_completo: sanitizedNome,
            email: sanitizedEmail,
            senha_hash: hashedPassword,
            cargo: formData.cargo,
            ativo: true
          });

        if (error) {
          if (error.code === '23505') {
            throw new Error('Este email já está cadastrado');
          }
          throw error;
        }

        await logActivity('create_user', `Novo usuário ${sanitizedNome} foi criado`);
        
        toast({
          title: "Sucesso",
          description: "Usuário criado com sucesso",
        });
      }

      setIsDialogOpen(false);
      setEditingUser(null);
      setFormData({ nome_completo: '', email: '', senha: '', cargo: '' as any });
      loadUsuarios();
    } catch (error: any) {
      console.error('Erro ao salvar usuário:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao salvar usuário",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (usuario: Usuario) => {
    if (!user || user.cargo !== 'admin') {
      toast({
        title: "Acesso negado",
        description: "Apenas administradores podem excluir usuários",
        variant: "destructive",
      });
      return;
    }

    if (usuario.id === user.id) {
      toast({
        title: "Erro",
        description: "Você não pode excluir sua própria conta",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('usuarios')
        .delete()
        .eq('id', usuario.id);

      if (error) {
        throw error;
      }

      await logActivity('delete_user', `Usuário ${usuario.nome_completo} foi excluído`);
      
      toast({
        title: "Sucesso",
        description: "Usuário excluído com sucesso",
      });

      loadUsuarios();
    } catch (error: any) {
      console.error('Erro ao excluir usuário:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir usuário",
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

  if (!user || user.cargo !== 'admin') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Acesso restrito a administradores</p>
        </div>
      </div>
    );
  }

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
                    {usuario.id !== user?.id && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir o usuário {usuario.nome_completo}? 
                              Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteUser(usuario)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Excluir
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
