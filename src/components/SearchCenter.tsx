
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, FileText, Users, Package, Calculator, Eye, Calendar, Phone, MapPin } from "lucide-react";

interface SearchResult {
  id: string;
  type: "os" | "client" | "stock" | "budget";
  title: string;
  subtitle: string;
  description: string;
  status?: string;
  date?: string;
  value?: string;
  extra?: string;
}

export function SearchCenter() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<string>("all");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Dados mockados para demonstração
  const mockData = {
    os: [
      {
        id: "02741",
        type: "os" as const,
        title: "OS #02741",
        subtitle: "João Silva - Dell G3",
        description: "Substituição de tela - Notebook Dell G3",
        status: "Em andamento",
        date: "2024-06-09",
        value: "R$ 450,00",
        extra: "Daniel Victor"
      },
      {
        id: "02740",
        type: "os" as const,
        title: "OS #02740",
        subtitle: "Ana Costa - Lenovo ThinkPad",
        description: "Troca de teclado ABNT2",
        status: "Finalizada",
        date: "2024-06-08",
        value: "R$ 200,00",
        extra: "Samuel"
      },
      {
        id: "02739",
        type: "os" as const,
        title: "OS #02739",
        subtitle: "Pedro Santos - MacBook Air",
        description: "Troca de placa mãe",
        status: "Cancelada",
        date: "2024-06-07",
        value: "R$ 1.000,00",
        extra: "Heinenger"
      }
    ],
    clients: [
      {
        id: "c001",
        type: "client" as const,
        title: "João Silva",
        subtitle: "(11) 99999-1234",
        description: "CPF: 123.456.789-00",
        status: "Ativo",
        date: "Cliente desde 2023",
        extra: "São Paulo, SP"
      },
      {
        id: "c002",
        type: "client" as const,
        title: "Ana Costa",
        subtitle: "(11) 88888-5678",
        description: "CPF: 987.654.321-00",
        status: "Ativo",
        date: "Cliente desde 2024",
        extra: "Rio de Janeiro, RJ"
      },
      {
        id: "c003",
        type: "client" as const,
        title: "Pedro Santos",
        subtitle: "(11) 77777-9999",
        description: "CNPJ: 12.345.678/0001-90",
        status: "Ativo",
        date: "Cliente desde 2022",
        extra: "Belo Horizonte, MG"
      }
    ],
    stock: [
      {
        id: "s001",
        type: "stock" as const,
        title: "Tela 15.6\" Full HD",
        subtitle: "Samsung LCD",
        description: "Categoria: Telas",
        status: "Baixo",
        value: "R$ 280,00",
        extra: "2 unidades"
      },
      {
        id: "s002",
        type: "stock" as const,
        title: "Teclado ABNT2 Notebook",
        subtitle: "Dell Mecânico",
        description: "Categoria: Teclados",
        status: "Normal",
        value: "R$ 85,00",
        extra: "8 unidades"
      },
      {
        id: "s003",
        type: "stock" as const,
        title: "SSD 256GB Kingston",
        subtitle: "Kingston SSD",
        description: "Categoria: Armazenamento",
        status: "Normal",
        value: "R$ 180,00",
        extra: "6 unidades"
      }
    ],
    budgets: [
      {
        id: "b001",
        type: "budget" as const,
        title: "Orçamento OS #02741",
        subtitle: "João Silva - Dell G3",
        description: "Substituição de tela",
        status: "Pendente",
        date: "2024-06-09",
        value: "R$ 450,00",
        extra: "Aguardando aprovação"
      },
      {
        id: "b002",
        type: "budget" as const,
        title: "Orçamento OS #02740",
        subtitle: "Ana Costa - Lenovo ThinkPad",
        description: "Troca de teclado",
        status: "Aprovado",
        date: "2024-06-08",
        value: "R$ 200,00",
        extra: "Aprovado pelo cliente"
      }
    ]
  };

  const performSearch = () => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    
    // Simular delay da busca
    setTimeout(() => {
      let searchResults: SearchResult[] = [];
      const term = searchTerm.toLowerCase();

      // Buscar em todas as categorias ou categoria específica
      const categories = searchType === "all" ? ["os", "clients", "stock", "budgets"] : [searchType];

      categories.forEach(category => {
        const data = mockData[category as keyof typeof mockData];
        
        const filtered = data.filter(item => 
          item.title.toLowerCase().includes(term) ||
          item.subtitle.toLowerCase().includes(term) ||
          item.description.toLowerCase().includes(term) ||
          (item.extra && item.extra.toLowerCase().includes(term))
        );

        searchResults = [...searchResults, ...filtered];
      });

      setResults(searchResults);
      setIsSearching(false);
    }, 500);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "os":
        return <FileText className="h-4 w-4" />;
      case "client":
        return <Users className="h-4 w-4" />;
      case "stock":
        return <Package className="h-4 w-4" />;
      case "budget":
        return <Calculator className="h-4 w-4" />;
      default:
        return <Search className="h-4 w-4" />;
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case "os":
        return "Ordem de Serviço";
      case "client":
        return "Cliente";
      case "stock":
        return "Estoque";
      case "budget":
        return "Orçamento";
      default:
        return "";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativo":
      case "Normal":
      case "Finalizada":
      case "Aprovado":
        return "bg-green-100 text-green-800";
      case "Em andamento":
      case "Pendente":
        return "bg-yellow-100 text-yellow-800";
      case "Baixo":
        return "bg-orange-100 text-orange-800";
      case "Cancelada":
      case "Rejeitado":
      case "Esgotado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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
          Busque em todo o sistema: OS, clientes, estoque e orçamentos
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Busca Avançada</CardTitle>
          <CardDescription>
            Digite um termo para buscar em todas as áreas do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Digite para buscar: nome, número, descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && performSearch()}
              />
            </div>
            <Select value={searchType} onValueChange={setSearchType}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                <SelectItem value="os">Ordens de Serviço</SelectItem>
                <SelectItem value="clients">Clientes</SelectItem>
                <SelectItem value="stock">Estoque</SelectItem>
                <SelectItem value="budgets">Orçamentos</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={performSearch} disabled={isSearching}>
              <Search className="h-4 w-4 mr-2" />
              {isSearching ? "Buscando..." : "Buscar"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resultados da Busca</CardTitle>
            <CardDescription>
              {results.length} resultado{results.length > 1 ? 's' : ''} encontrado{results.length > 1 ? 's' : ''} para "{searchTerm}"
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.map((result) => (
                <div key={`${result.type}-${result.id}`} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {getTypeIcon(result.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{result.title}</h3>
                        <Badge variant="outline" className="text-xs">
                          {getTypeName(result.type)}
                        </Badge>
                        {result.status && (
                          <Badge className={getStatusColor(result.status)}>
                            {result.status}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{result.subtitle}</p>
                      <p className="text-sm">{result.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        {result.date && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {result.date}
                          </div>
                        )}
                        {result.value && (
                          <div className="font-medium text-primary">
                            {result.value}
                          </div>
                        )}
                        {result.extra && (
                          <div className="flex items-center gap-1">
                            {result.type === "client" ? <MapPin className="h-3 w-3" /> : null}
                            {result.extra}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {searchTerm && results.length === 0 && !isSearching && (
        <Card>
          <CardContent className="text-center py-8">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium">Nenhum resultado encontrado</p>
            <p className="text-muted-foreground">
              Tente buscar com outros termos ou verifique a categoria selecionada
            </p>
          </CardContent>
        </Card>
      )}

      {!searchTerm && (
        <Card>
          <CardContent className="text-center py-8">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium">Digite algo para começar a busca</p>
            <p className="text-muted-foreground">
              Você pode buscar por números de OS, nomes de clientes, produtos do estoque ou orçamentos
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
