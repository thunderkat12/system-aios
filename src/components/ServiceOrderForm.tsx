
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { FormFields, ServiceOrderData } from "./service-order/FormFields";
import { NotificationInfo } from "./service-order/NotificationInfo";
import { useServiceOrderSubmit } from "./service-order/useServiceOrderSubmit";
import { REPAIR_TYPES, TECHNICIANS } from "./service-order/constants";

export function ServiceOrderForm() {
  const [osData, setOsData] = useState<ServiceOrderData>({
    customerName: "",
    customerWhatsapp: "",
    deviceModel: "",
    repairType: "",
    technician: "",
    priority: "Normal",
    description: "",
    estimatedValue: ""
  });

  const { handleSubmit, isLoading } = useServiceOrderSubmit();

  const resetForm = () => {
    setOsData({
      customerName: "",
      customerWhatsapp: "",
      deviceModel: "",
      repairType: "",
      technician: "",
      priority: "Normal",
      description: "",
      estimatedValue: ""
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
          Geração automática de OS com preenchimento inteligente
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Nova Ordem de Serviço</CardTitle>
          <CardDescription>
            Preencha os dados para gerar uma nova OS. O tipo de reparo será sugerido automaticamente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <FormFields 
              osData={osData}
              setOsData={setOsData}
              repairTypes={REPAIR_TYPES}
              technicians={TECHNICIANS}
            />

            <NotificationInfo />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Gerando OS e enviando notificação..." : "Gerar Ordem de Serviço"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
