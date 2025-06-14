
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, CreditCard, DollarSign, ArrowLeft } from "lucide-react";
import { PAYMENT_METHODS, WEBHOOKS } from "./service-order/constants";

interface PaymentData {
  method: string;
  amount: string;
}

interface OSFinalizationProps {
  onBack?: () => void;
}

export function OSFinalization({ onBack }: OSFinalizationProps) {
  const [osNumber, setOsNumber] = useState("");
  const [payments, setPayments] = useState<PaymentData[]>([{ method: "", amount: "" }]);
  const [totalValue, setTotalValue] = useState("");
  const [serviceNotes, setServiceNotes] = useState("");
  const [customerSatisfaction, setCustomerSatisfaction] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const addPaymentMethod = () => {
    setPayments([...payments, { method: "", amount: "" }]);
  };

  const removePaymentMethod = (index: number) => {
    if (payments.length > 1) {
      setPayments(payments.filter((_, i) => i !== index));
    }
  };

  const updatePayment = (index: number, field: keyof PaymentData, value: string) => {
    const updatedPayments = payments.map((payment, i) => 
      i === index ? { ...payment, [field]: value } : payment
    );
    setPayments(updatedPayments);
  };

  const calculateTotal = () => {
    return payments.reduce((total, payment) => {
      const amount = parseFloat(payment.amount.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
      return total + amount;
    }, 0);
  };

  const handleFinalization = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!osNumber || !totalValue) {
      toast({
        title: "Erro",
        description: "Preencha o número da OS e o valor total",
        variant: "destructive",
      });
      return;
    }

    const validPayments = payments.filter(p => p.method && p.amount);
    if (validPayments.length === 0) {
      toast({
        title: "Erro",
        description: "Adicione pelo menos uma forma de pagamento",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const finalizationData = {
      osNumber: osNumber,
      finalizationDate: new Date().toISOString(),
      totalValue: totalValue,
      calculatedTotal: calculateTotal(),
      payments: validPayments,
      serviceNotes: serviceNotes,
      customerSatisfaction: customerSatisfaction,
      company: "Hi-Tech Soluções",
      finalizedBy: "Sistema", // Aqui poderia vir do usuário logado
      status: "Finalizada"
    };

    console.log("Enviando dados de finalização para webhook n8n:", finalizationData);

    try {
      const response = await fetch(WEBHOOKS.RELATORIO_OS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalizationData),
      });

      if (response.ok) {
        toast({
          title: "OS Finalizada com Sucesso!",
          description: `OS #${osNumber} finalizada. Relatório enviado para automação n8n.`,
        });

        console.log("Webhook relatorio-os disparado com sucesso para n8n");
        
        // Limpar formulário
        setOsNumber("");
        setPayments([{ method: "", amount: "" }]);
        setTotalValue("");
        setServiceNotes("");
        setCustomerSatisfaction("");
      } else {
        throw new Error("Falha ao enviar webhook");
      }
    } catch (error) {
      console.error("Erro ao disparar webhook:", error);
      
      toast({
        title: "OS Finalizada (Webhook falhou)",
        description: `OS #${osNumber} finalizada localmente. Erro na automação n8n.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
            <CheckCircle className="h-8 w-8" />
            Finalização de OS
          </h1>
          <p className="text-muted-foreground">
            Finalize ordens de serviço e envie relatórios automaticamente
          </p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Finalizar Ordem de Serviço</CardTitle>
          <CardDescription>
            Registre os valores recebidos e finalize a OS. Os dados serão enviados automaticamente para o sistema de relatórios.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFinalization} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="osNumber">Número da OS *</Label>
              <Input
                id="osNumber"
                placeholder="Ex: 02741"
                value={osNumber}
                onChange={(e) => setOsNumber(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalValue">Valor Total do Serviço *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="totalValue"
                  placeholder="R$ 0,00"
                  className="pl-10"
                  value={totalValue}
                  onChange={(e) => setTotalValue(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Formas de Pagamento Recebidas</Label>
                <Button type="button" variant="outline" size="sm" onClick={addPaymentMethod}>
                  + Adicionar Forma
                </Button>
              </div>
              
              {payments.map((payment, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-2 p-3 border rounded-lg">
                  <Select
                    value={payment.method}
                    onValueChange={(value) => updatePayment(index, 'method', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Forma de pagamento" />
                    </SelectTrigger>
                    <SelectContent>
                      {PAYMENT_METHODS.map((method) => (
                        <SelectItem key={method} value={method}>
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            {method}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Input
                    placeholder="R$ 0,00"
                    value={payment.amount}
                    onChange={(e) => updatePayment(index, 'amount', e.target.value)}
                  />
                  
                  {payments.length > 1 && (
                    <Button 
                      type="button" 
                      variant="destructive" 
                      size="sm"
                      onClick={() => removePaymentMethod(index)}
                    >
                      Remover
                    </Button>
                  )}
                </div>
              ))}
              
              <div className="text-sm text-muted-foreground">
                Total calculado: R$ {calculateTotal().toFixed(2).replace('.', ',')}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerSatisfaction">Avaliação do Cliente</Label>
              <Select
                value={customerSatisfaction}
                onValueChange={setCustomerSatisfaction}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Como o cliente avaliou o serviço?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Muito Satisfeito">⭐⭐⭐⭐⭐ Muito Satisfeito</SelectItem>
                  <SelectItem value="Satisfeito">⭐⭐⭐⭐ Satisfeito</SelectItem>
                  <SelectItem value="Regular">⭐⭐⭐ Regular</SelectItem>
                  <SelectItem value="Insatisfeito">⭐⭐ Insatisfeito</SelectItem>
                  <SelectItem value="Muito Insatisfeito">⭐ Muito Insatisfeito</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="serviceNotes">Observações Finais</Label>
              <Textarea
                id="serviceNotes"
                placeholder="Observações sobre o serviço realizado, peças utilizadas, etc..."
                rows={4}
                value={serviceNotes}
                onChange={(e) => setServiceNotes(e.target.value)}
              />
            </div>

            <div className="bg-card p-4 rounded-lg border">
              <h3 className="font-medium text-sm mb-2">🔄 Automação Ativada</h3>
              <p className="text-sm text-muted-foreground">
                Ao finalizar, os dados serão enviados automaticamente para o webhook de relatórios do n8n, 
                incluindo todas as formas de pagamento e valores recebidos.
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Finalizando e enviando relatório..." : "Finalizar OS e Enviar Relatório"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
