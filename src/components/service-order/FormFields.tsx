import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { User, Wrench, MessageSquare } from "lucide-react";

interface ServiceOrderData {
  customerName: string;
  customerWhatsapp: string;
  deviceModel: string;
  repairType: string;
  technician: string;
  priority: string;
  description: string;
  estimatedValue: string;
}

interface FormFieldsProps {
  osData: ServiceOrderData;
  setOsData: React.Dispatch<React.SetStateAction<ServiceOrderData>>;
  repairTypes: string[];
  technicians: string[];
}

export function FormFields({ osData, setOsData, repairTypes, technicians }: FormFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="customerName">Nome do Cliente *</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="customerName"
              placeholder="Nome do cliente"
              className="pl-10"
              value={osData.customerName}
              onChange={(e) => setOsData(prev => ({ ...prev, customerName: e.target.value }))}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="customerWhatsapp">WhatsApp do Cliente *</Label>
          <div className="relative">
            <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="customerWhatsapp"
              placeholder="(11) 99999-9999"
              className="pl-10"
              value={osData.customerWhatsapp}
              onChange={(e) => setOsData(prev => ({ ...prev, customerWhatsapp: e.target.value }))}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="deviceModel">Modelo do Aparelho *</Label>
        <Input
          id="deviceModel"
          placeholder="Ex: Dell G3, MacBook Pro"
          value={osData.deviceModel}
          onChange={(e) => setOsData(prev => ({ ...prev, deviceModel: e.target.value }))}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="repairType">Tipo de Reparo *</Label>
          <Select
            value={osData.repairType}
            onValueChange={(value) => setOsData(prev => ({ ...prev, repairType: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo de reparo" />
            </SelectTrigger>
            <SelectContent>
              {repairTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="technician">Técnico Responsável *</Label>
          <Select
            value={osData.technician}
            onValueChange={(value) => setOsData(prev => ({ ...prev, technician: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o técnico" />
            </SelectTrigger>
            <SelectContent>
              {technicians.map((tech) => (
                <SelectItem key={tech} value={tech}>
                  <div className="flex items-center gap-2">
                    <Wrench className="h-4 w-4" />
                    {tech}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="priority">Prioridade</Label>
          <Select
            value={osData.priority}
            onValueChange={(value) => setOsData(prev => ({ ...prev, priority: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Baixa">Baixa</SelectItem>
              <SelectItem value="Normal">Normal</SelectItem>
              <SelectItem value="Alta">Alta</SelectItem>
              <SelectItem value="Urgente">Urgente</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="estimatedValue">Valor Estimado</Label>
          <Input
            id="estimatedValue"
            placeholder="R$ 0,00"
            value={osData.estimatedValue}
            onChange={(e) => setOsData(prev => ({ ...prev, estimatedValue: e.target.value }))}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição do Problema</Label>
        <Textarea
          id="description"
          placeholder="Descreva detalhadamente o problema relatado pelo cliente..."
          rows={4}
          value={osData.description}
          onChange={(e) => setOsData(prev => ({ ...prev, description: e.target.value }))}
        />
      </div>
    </>
  );
}

export type { ServiceOrderData };
