
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, Calendar, User, FileText, Wrench } from "lucide-react";

interface SearchResult {
  id: string;
  type: "os" | "customer" | "product";
  osNumber?: string;
  customerName: string;
  phone?: string;
  cpfCnpj?: string;
  deviceModel?: string;
  repairType?: string;
  technician?: string;
  status: string;
  date: string;
  value?: string;
}

export function SearchCenter() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Dados mockados para demonstração
  const mockData: SearchResult[] = [
    {
      id: "1",
      type: "os",
      osNumber: "02741",
      customerName: "João Silva",
      phone: "(11) 99999-9999",
      cpfCnpj: "123.456.789-00",
      deviceModel: "Dell G3",
      repairType: "Substituição de tela",
      technician: "Samuel",
      status: "Em Andamento",
      date: "2024-06-09",
      value: "R$ 450,00"
    },
    {
      id: "2",
      type: "os",
      osNumber: "02740",
      customerName: "Maria Santos",
      phone: "(11) 88888-8888",
      cpfCnpj: "987.654.321-00",
      deviceModel: "MacBook Pro 13",
      repairType: "Troca de teclado",
      technician: "Heinenger",
      status: "Finalizado",
      date: "2024-06-08",
      value: "R$ 380,00"
    },
    {
      id: "3",
      type: "customer",
      customerName: "Carlos Oliveira",
      phone: "(11) 77777-7777",
      cpfCnpj: "456.789.123-00",
      status: "Ativo",
      date: "2024-06-07"
    }
  ];

  const handleSearch = () => {
    setIsSearching(true);
    
    // Simular busca
    setTimeout(() => {
      let filteredResults = mockData;

      if (searchTerm) {
        filteredResults = filteredResults.filter(item =>
          item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.osNumber?.includes(searchTerm) ||
          item.phone?.includes(searchTerm) ||
          item.cpfCnpj?.includes(searchTerm) ||
          item.deviceModel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.repairType?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (searchType !== "all") {
        filteredResults = filteredResults.filter(item => item.type === searchType);
      }

      if (statusFilter) {
        filteredResults = filteredResults.filter(item => item.status === statusFilter);
      }

      if (dateFilter) {
        filteredResults = filteredResults.filter(item => item.date >= dateFilter);
      }

      setResults(filteredResults);
      setIsSearching(false);
    }, 500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Finalizado":
        return "bg-green-100 text-green-800";
      case "Em Andamento":
        return "bg-blue-100 text-blue-800";
      case "Aguardando Peças":
        return "bg-yellow-100 text-yellow-800";
      case "Ativo":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "os":
        return <FileText className="h-4 w-4" />;
      case "customer":
        return <User className="h-4 w-4" />;
      case "product":
        return <Wrench className="h-4 w-4" />;
      default:
        return <Search className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
          <Search className="h-8 w-8" />
          Central de Busca
        </h1>
        <p className="text-muted-foreground">
          Busque OS, clientes e produtos de forma rápida e eficiente
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Busca Avançada</CardTitle>
          <CardDescription>
            Use os filtros para encontrar exatamente o que procura
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="searchTerm">Termo de Busca</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="searchTerm"
                  placeholder="Nome, OS, telefone, CPF..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="searchType">Tipo</Label>
              <Select value={searchType} onValueChange={setSearchType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="os">Ordens de Serviço</SelectItem>
                  <SelectItem value="customer">Clientes</SelectItem>
                  <SelectItem value="product">Produtos/Serviços</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="statusFilter">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                  <SelectItem value="Finalizado">Finalizado</SelectItem>
                  <SelectItem value="Aguardando Peças">Aguardando Peças</SelectItem>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateFilter">Data (a partir de)</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="dateFilter"
                  type="date"
                  className="pl-10"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
              </div>
            </div>
          </div>

          <Button onClick={handleSearch} disabled={isSearching} className="w-full">
            <Filter className="mr-2 h-4 w-4" />
            {isSearching ? "Buscando..." : "Buscar"}
          </Button>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resultados da Busca</CardTitle>
            <CardDescription>
              {results.length} resultado{results.length > 1 ? 's' : ''} encontrado{results.length > 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Identificação</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Detalhes</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(result.type)}
                        <span className="capitalize">{result.type === "os" ? "OS" : result.type === "customer" ? "Cliente" : "Produto"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {result.osNumber ? `OS #${result.osNumber}` : result.cpfCnpj}
                    </TableCell>
                    <TableCell className="font-medium">{result.customerName}</TableCell>
                    <TableCell>{result.phone}</TableCell>
                    <TableCell>
                      {result.deviceModel && (
                        <div className="text-sm">
                          <div>{result.deviceModel}</div>
                          <div className="text-muted-foreground">{result.repairType}</div>
                          {result.technician && (
                            <div className="text-muted-foreground">Téc: {result.technician}</div>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(result.status)}>
                        {result.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(result.date).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>{result.value || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {results.length === 0 && searchTerm && !isSearching && (
        <Card>
          <CardContent className="text-center py-8">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium">Nenhum resultado encontrado</p>
            <p className="text-muted-foreground">
              Tente ajustar os filtros ou termo de busca
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
