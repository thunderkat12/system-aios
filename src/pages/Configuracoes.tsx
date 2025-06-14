
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Building2, Palette, Link, Shield, Trash2 } from "lucide-react";
import { useEmpresaConfig } from '@/hooks/useEmpresaConfig';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface ConfiguracoesProps {
  onBack?: () => void;
}

const Configuracoes = ({ onBack }: ConfiguracoesProps) => {
  const { config, updateConfig } = useEmpresaConfig();
  const { userProfile } = useAuth();
  const { toast } = useToast();
  
  const [nomeEmpresa, setNomeEmpresa] = useState(config?.nome_empresa || '');
  const [temaPrimario, setTemaPrimario] = useState(config?.tema_primario || '#2563eb');
  const [temaSecundario, setTemaSecundario] = useState(config?.tema_secundario || '#64748b');
  const [webhookUrl, setWebhookUrl] = useState(config?.webhook_url || '');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    await updateConfig({
      nome_empresa: nomeEmpresa,
      tema_primario: temaPrimario,
      tema_secundario: temaSecundario
    });
    
    setIsLoading(false);
  };

  const handleUpdateWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    await updateConfig({
      webhook_url: webhookUrl || null
    });
    
    setIsLoading(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (novaSenha !== confirmarSenha) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive"
      });
      return;
    }

    if (novaSenha.length < 6) {
      toast({
        title: "Erro",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive"
      });
      return;
    }

    // Implementar mudança de senha via Supabase
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A alteração de senha será implementada em breve.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        {onBack && (
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        )}
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
            <Building2 className="h-8 w-8" />
            Configurações
          </h1>
          <p className="text-muted-foreground">
            Gerencie sua conta e personalize o sistema
          </p>
        </div>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="account">Minha Conta</TabsTrigger>
          <TabsTrigger value="integrations">Integrações</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Informações da Empresa
              </CardTitle>
              <CardDescription>
                Atualize o nome e tema visual da sua empresa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateAccount} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome_empresa">Nome da Empresa</Label>
                  <Input
                    id="nome_empresa"
                    value={nomeEmpresa}
                    onChange={(e) => setNomeEmpresa(e.target.value)}
                    placeholder="Digite o nome da empresa"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    <Label>Tema de Cores</Label>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tema_primario">Cor Primária</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={temaPrimario}
                          onChange={(e) => setTemaPrimario(e.target.value)}
                          className="w-16 h-10 p-1 border rounded"
                          disabled={isLoading}
                        />
                        <Input
                          type="text"
                          value={temaPrimario}
                          onChange={(e) => setTemaPrimario(e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tema_secundario">Cor Secundária</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={temaSecundario}
                          onChange={(e) => setTemaSecundario(e.target.value)}
                          className="w-16 h-10 p-1 border rounded"
                          disabled={isLoading}
                        />
                        <Input
                          type="text"
                          value={temaSecundario}
                          onChange={(e) => setTemaSecundario(e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="h-5 w-5" />
                Webhooks
              </CardTitle>
              <CardDescription>
                Configure URLs de webhook para integração com sistemas externos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateWebhook} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="webhook_url">URL do Webhook</Label>
                  <Textarea
                    id="webhook_url"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://exemplo.com/webhook"
                    disabled={isLoading}
                    rows={3}
                  />
                  <p className="text-sm text-muted-foreground">
                    Esta URL será chamada quando eventos importantes acontecerem no sistema
                  </p>
                </div>

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Salvando..." : "Salvar Webhook"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Alterar Senha
              </CardTitle>
              <CardDescription>
                Atualize sua senha de acesso ao sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nova_senha">Nova Senha</Label>
                  <Input
                    id="nova_senha"
                    type="password"
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmar_senha">Confirmar Nova Senha</Label>
                  <Input
                    id="confirmar_senha"
                    type="password"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    placeholder="Digite a senha novamente"
                    disabled={isLoading}
                  />
                </div>

                <Button type="submit" disabled={isLoading || !novaSenha || novaSenha !== confirmarSenha}>
                  {isLoading ? "Alterando..." : "Alterar Senha"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <Trash2 className="h-5 w-5" />
                Zona de Perigo
              </CardTitle>
              <CardDescription>
                Ações irreversíveis para sua conta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" disabled>
                Excluir Conta (Em desenvolvimento)
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                Esta ação não pode ser desfeita e removerá permanentemente todos os seus dados.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Configuracoes;
