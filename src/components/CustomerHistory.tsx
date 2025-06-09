
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { History, Search, Eye, Calendar, User, Laptop } from "lucide-react";

export function CustomerHistory() {
  const [searchTerm, setSearchTerm] = useState("");

  // Dados mockados para demonstração
  const customerHistory = [
    {
      id: 1,
      customerName: "João Silva",
      phone: "(11) 99999-9999",
      services: [
        {
          osNumber: "02741",
          device: "Dell G3",
          repairType: "Substituição de tela",
          technician: "Samuel",
          status: "Em Andamento",
          date: "2024-06-09",
          value: "R$ 450,00"
        },
        {
          osNumber: "02720",
          device: "Dell G3",
          repairType: "Limpeza e manutenção",
          technician: "Daniel Victor",
          status: "Finalizado",
          date: "2024-05-15",
          value: "R$ 150,00"
        }
      ]
    },
    {
      id: 2,
      customerName: "Maria Santos",
      phone: "(11) 88888-8888",
      services: [
        {
          osNumber: "02738",
          device: "MacBook Pro 13",
          repairType: "Troca de teclado",
          technician: "Heinenger",
          status: "Finalizado",
          date: "2024-06-08",
          value: "R$ 380,00"
        }
      ]
    },
    {
      id: 3,
      customerName: "Carlos Oliveira",
      phone: "(11) 77777-7777",
      services: [
        {
          osNumber: "02735",
          device: "Lenovo IdeaPad",
          repairType: "Instalação de sistema",
          technician: "Daniel Victor",
          status: "Aguardando Peças",
          date: "2024-06-07",
          value: "R$ 120,00"
        }
      ]
    }
  ];

  const filteredHistory = customerHistory.filter(customer =>
    customer.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Finalizado":
        return "bg-green-100 text-green-800";
      case "Em Andamento":
        return "bg-blue-100 text-blue-800";
      case "Aguardando Peças":
        return "bg-yellow-100 text-yellow-800";
      case "Aguardando Aprovação":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
          <History className="h-8 w-8" />
          Histórico de Atendimentos
        </h1>
        <p className="text-muted-foreground">
          Visualize a linha do tempo de todos os serviços realizados por cliente
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Buscar Cliente</CardTitle>
          <CardDescription>
            Digite o nome ou telefone do cliente para visualizar o histórico
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou telefone..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredHistory.map((customer) => (
          <Card key={customer.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle className="text-lg">{customer.customerName}</CardTitle>
                    <CardDescription>{customer.phone}</CardDescription>
                  </div>
                </div>
                <Badge variant="outline">
                  {customer.services.length} serviço{customer.services.length > 1 ? 's' : ''}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {customer.services.map((service, index) => (
                  <div key={service.osNumber} className="relative">
                    {index < customer.services.length - 1 && (
                      <div className="absolute left-6 top-12 bottom-0 w-px bg-border" />
                    )}
                    <div className="flex items-start gap-4 p-3 bg-card rounded-lg border">
                      <div className="flex-shrink-0 w-3 h-3 bg-primary rounded-full mt-2" />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">OS #{service.osNumber}</span>
                            <Badge className={getStatusColor(service.status)}>
                              {service.status}
                            </Badge>
                          </div>
                          <span className="text-sm text-muted-foreground">{service.value}</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                          <div className="flex items-center gap-1">
                            <Laptop className="h-4 w-4 text-muted-foreground" />
                            <span>{service.device}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span>{service.technician}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{new Date(service.date).toLocaleDateString('pt-BR')}</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{service.repairType}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredHistory.length === 0 && searchTerm && (
        <Card>
          <CardContent className="text-center py-8">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium">Nenhum cliente encontrado</p>
            <p className="text-muted-foreground">
              Tente buscar por outro nome ou telefone
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
