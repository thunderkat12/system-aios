
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { FormFields, ServiceOrderData } from "./service-order/FormFields";
import { NotificationInfo } from "./service-order/NotificationInfo";
import { useServiceOrderSubmit } from "./service-order/useServiceOrderSubmit";
import { REPAIR_TYPES, TECHNICIANS, PAYMENT_METHODS } from "./service-order/constants";

export function ServiceOrderForm() {
  const [osData, setOsData] = useState<ServiceOrderData>({
    customerName: "",
    customerWhatsapp: "",
    customerCpfCnpj: "",
    deviceModel: "",
    deviceBrand: "",
    repairType: "",
    technician: "",
    priority: "Normal",
    description: "",
    estimatedValue: "",
    paymentMethod: "",
    observations: "",
    problemDescription: ""
  });

  const { handleSubmit, isLoading } = useServiceOrderSubmit();

  const resetForm = () => {
    setOsData({
      customerName: "",
      customerWhatsapp: "",
      customerCpfCnpj: "",
      deviceModel: "",
      deviceBrand: "",
      repairType: "",
      technician: "",
      priority: "Normal",
      description: "",
      estimatedValue: "",
      paymentMethod: "",
      observations: "",
      problemDescription: ""
    });
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(osData, resetForm);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
          <FileText className="h-8 w-8" />
          Ordem de Serviço
        </h1>
        <p className="text-muted-foreground">
          Geração automática de OS com integração completa ao n8n
        </p>
      </div>

      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle>Nova Ordem de Serviço</CardTitle>
          <CardDescription>
            Preencha os dados para gerar uma nova OS. Todos os dados serão enviados automaticamente para o sistema de automação.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <FormFields 
              osData={osData}
              setOsData={setOsData}
              repairTypes={REPAIR_TYPES}
              technicians={TECHNICIANS}
              paymentMethods={PAYMENT_METHODS}
            />

            <NotificationInfo />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Gerando OS e enviando para automação..." : "Gerar Ordem de Serviço"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
