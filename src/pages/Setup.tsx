
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Palette } from "lucide-react";
import { useEmpresaConfig } from '@/hooks/useEmpresaConfig';

const Setup = () => {
  const [nomeEmpresa, setNomeEmpresa] = useState('');
  const [temaPrimario, setTemaPrimario] = useState('#2563eb');
  const [temaSecundario, setTemaSecundario] = useState('#64748b');
  const [isLoading, setIsLoading] = useState(false);
  const { createConfig } = useEmpresaConfig();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nomeEmpresa.trim()) {
      return;
    }

    setIsLoading(true);
    
    const result = await createConfig({
      nome_empresa: nomeEmpresa.trim(),
      tema_primario: temaPrimario,
      tema_secundario: temaSecundario
    });

    if (result.success) {
      navigate('/');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Building2 className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl">Configuração Inicial</CardTitle>
          <CardDescription>
            Configure sua empresa para começar a usar o sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome_empresa">Nome da Empresa *</Label>
              <Input
                id="nome_empresa"
                type="text"
                placeholder="Digite o nome da sua empresa"
                value={nomeEmpresa}
                onChange={(e) => setNomeEmpresa(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                <Label>Escolha as cores do seu tema</Label>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tema_primario">Cor Primária</Label>
                  <div className="flex gap-2">
                    <Input
                      id="tema_primario"
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
                      placeholder="#2563eb"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tema_secundario">Cor Secundária</Label>
                  <div className="flex gap-2">
                    <Input
                      id="tema_secundario"
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
                      placeholder="#64748b"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading || !nomeEmpresa.trim()}>
              {isLoading ? "Configurando..." : "Salvar e Continuar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Setup;
