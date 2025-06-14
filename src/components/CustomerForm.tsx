
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Users, Phone, Laptop, FileText, MessageSquare, ArrowLeft } from "lucide-react";

interface CustomerFormProps {
  onBack?: () => void;
}

export function CustomerForm({ onBack }: CustomerFormProps) {
  const [customerData, setCustomerData] = useState({
    name: "",
    phone: "",
    whatsapp: "",
    document: "",
    documentType: "CPF",
    deviceModel: "",
    deviceBrand: "",
    status: "Recebido"
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerData.name || !customerData.phone || !customerData.deviceModel) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    // Simular integração com webhook do n8n
    console.log("Enviando dados para n8n:", customerData);
    
    toast({
      title: "Cliente cadastrado!",
      description: `${customerData.name} foi cadastrado e receberá notificação via WhatsApp`,
    });

    // Limpar formulário
    setCustomerData({
      name: "",
      phone: "",
      whatsapp: "",
      document: "",
      documentType: "CPF",
      deviceModel: "",
      deviceBrand: "",
      status: "Recebido"
    });
  };

  const deviceBrands = [
    "Dell", "HP", "Lenovo", "Acer", "Asus", "Apple", "Samsung", "Positivo", "Vaio", "Outro"
  ];

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
            <Users className="h-8 w-8" />
            Cadastro de Clientes
          </h1>
          <p className="text-muted-foreground">
            Registre novos clientes e aparelhos para assistência técnica
          </p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Novo Cliente</CardTitle>
          <CardDescription>
            Preencha os dados do cliente e do aparelho. Uma OS será gerada automaticamente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Cliente *</Label>
                <Input
                  id="name"
                  placeholder="Digite o nome completo"
                  value={customerData.name}
                  onChange={(e) => setCustomerData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    placeholder="(11) 99999-9999"
                    className="pl-10"
                    value={customerData.phone}
                    onChange={(e) => setCustomerData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="whatsapp"
                    placeholder="(11) 99999-9999"
                    className="pl-10"
                    value={customerData.whatsapp}
                    onChange={(e) => setCustomerData(prev => ({ ...prev, whatsapp: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="documentType">Tipo de Documento</Label>
                <Select
                  value={customerData.documentType}
                  onValueChange={(value) => setCustomerData(prev => ({ ...prev, documentType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CPF">CPF</SelectItem>
                    <SelectItem value="CNPJ">CNPJ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="document">{customerData.documentType}</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="document"
                  placeholder={customerData.documentType === "CPF" ? "000.000.000-00" : "00.000.000/0000-00"}
                  className="pl-10"
                  value={customerData.document}
                  onChange={(e) => setCustomerData(prev => ({ ...prev, document: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="deviceBrand">Marca do Aparelho</Label>
                <Select
                  value={customerData.deviceBrand}
                  onValueChange={(value) => setCustomerData(prev => ({ ...prev, deviceBrand: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a marca" />
                  </SelectTrigger>
                  <SelectContent>
                    {deviceBrands.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="deviceModel">Modelo do Aparelho *</Label>
                <div className="relative">
                  <Laptop className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="deviceModel"
                    placeholder="Ex: Dell G3, MacBook Pro 13"
                    className="pl-10"
                    value={customerData.deviceModel}
                    onChange={(e) => setCustomerData(prev => ({ ...prev, deviceModel: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status Inicial</Label>
              <Select
                value={customerData.status}
                onValueChange={(value) => setCustomerData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Recebido">Recebido</SelectItem>
                  <SelectItem value="Em Análise">Em Análise</SelectItem>
                  <SelectItem value="Aguardando Orçamento">Aguardando Orçamento</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-card p-4 rounded-lg border">
              <h3 className="font-medium text-sm mb-2">🔁 Integração Automática</h3>
              <p className="text-sm text-muted-foreground">
                Ao cadastrar, o cliente receberá automaticamente uma mensagem no WhatsApp 
                com os detalhes do atendimento e número da OS.
              </p>
            </div>

            <Button type="submit" className="w-full">
              Cadastrar Cliente e Gerar OS
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
