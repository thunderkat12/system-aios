
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, FileText, User, Package, Calendar, Phone, CreditCard } from "lucide-react";

interface SearchResult {
  id: string;
  type: 'os' | 'customer' | 'product';
  title: string;
  subtitle: string;
  details: Record<string, string>;
  status?: string;
  date?: string;
}

export function SearchCenter() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<string>("all");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Dados mockados para demonstração
  const mockData = {
    orders: [
      {
        id: "os_02741",
        type: "os" as const,
        title: "OS #02741",
        subtitle: "João Silva - Dell G3",
        details: {
          cliente: "João Silva",
          whatsapp: "(11) 99999-1111",
          aparelho: "Dell G3",
          problema: "Substituição de tela",
          tecnico: "Daniel Victor",
          valor: "R$ 450,00"
        },
        status: "Em andamento",
        date: "2024-06-09"
      },
      {
        id: "os_02740",
        type: "os" as const,
        title: "OS #02740",
        subtitle: "Ana Costa - Lenovo ThinkPad",
        details: {
          cliente: "Ana Costa",
          whatsapp: "(11) 88888-2222",
          aparelho: "Lenovo ThinkPad",
          problema: "Troca de teclado",
          tecnico: "Samuel",
          valor: "R$ 200,00"
        },
        status: "Finalizada",
        date: "2024-06-08"
      }
    ],
    customers: [
      {
        id: "customer_001",
        type: "customer" as const,
        title: "João Silva",
        subtitle: "(11) 99999-1111",
        details: {
          nome: "João Silva",
          whatsapp: "(11) 99999-1111",
          cpf: "123.456.789-00",
          email: "joao@email.com",
          endereco: "Rua das Flores, 123"
        },
        date: "2024-06-01"
      },
      {
        id: "customer_002",
        type: "customer" as const,
        title: "Ana Costa",
        subtitle: "(11) 88888-2222",
        details: {
          nome: "Ana Costa",
          whatsapp: "(11) 88888-2222",
          cpf: "987.654.321-00",
          email: "ana@email.com",
          endereco: "Av. Principal, 456"
        },
        date: "2024-05-28"
      }
    ],
    products: [
      {
        id: "product_001",
        type: "product" as const,
        title: "Tela 15.6\" Full HD",
        subtitle: "Categoria: Telas",
        details: {
          nome: "Tela 15.6\" Full HD",
          categoria: "Telas",
          quantidade: "2",
          preco: "R$ 280,00",
          status: "Estoque baixo"
        }
      },
      {
        id: "product_002",
        type: "product" as const,
        title: "Teclado ABNT2 Notebook",
        subtitle: "Categoria: Teclados",
        details: {
          nome: "Teclado ABNT2 Notebook",
          categoria: "Teclados",
          quantidade: "8",
          preco: "R$ 85,00",
          status: "Normal"
        }
      }
    ]
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    // Simular delay de busca
    setTimeout(() => {
      let results: SearchResult[] = [];
      const term = searchTerm.toLowerCase();

      // Buscar em ordens de serviço
      if (searchType === "all" || searchType === "os") {
        const osResults = mockData.orders.filter(order => 
          order.title.toLowerCase().includes(term) ||
          order.subtitle.toLowerCase().includes(term) ||
          order.details.cliente.toLowerCase().includes(term) ||
          order.details.whatsapp.includes(term) ||
          order.date.includes(term)
        );
        results = [...results, ...osResults];
      }

      // Buscar em clientes
      if (searchType === "all" || searchType === "customers") {
        const customerResults = mockData.customers.filter(customer =>
          customer.details.nome.toLowerCase().includes(term) ||
          customer.details.whatsapp.includes(term) ||
          customer.details.cpf.includes(term) ||
          customer.details.email.toLowerCase().includes(term)
        );
        results = [...results, ...customerResults];
      }

      // Buscar em produtos
      if (searchType === "all" || searchType === "products") {
        const productResults = mockData.products.filter(product =>
          product.details.nome.toLowerCase().includes(term) ||
          product.details.categoria.toLowerCase().includes(term)
        );
        results = [...results, ...productResults];
      }

      setSearchResults(results);
      setIsSearching(false);
    }, 500);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'os':
        return <FileText className="h-5 w-5 text-blue-600" />;
      case 'customer':
        return <User className="h-5 w-5 text-green-600" />;
      case 'product':
        return <Package className="h-5 w-5 text-purple-600" />;
      default:
        return <Search className="h-5 w-5" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'os':
        return 'Ordem de Serviço';
      case 'customer':
        return 'Cliente';
      case 'product':
        return 'Produto';
      default:
        return '';
    }
  };

  const getStatusColor = (status?: string) => {
    if (!status) return "bg-gray-100 text-gray-800";
    
    switch (status.toLowerCase()) {
      case 'finalizada':
      case 'normal':
        return "bg-green-100 text-green-800";
      case 'em andamento':
        return "bg-blue-100 text-blue-800";
      case 'pendente':
        return "bg-yellow-100 text-yellow-800";
      case 'estoque baixo':
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
          Busque rapidamente por OSs, clientes ou produtos em todo o sistema
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Busca Avançada</CardTitle>
          <CardDescription>
            Digite um termo de busca e selecione onde procurar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Digite o que você está procurando..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Select value={searchType} onValueChange={setSearchType}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Buscar em..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tudo</SelectItem>
                <SelectItem value="os">Ordens de Serviço</SelectItem>
                <SelectItem value="customers">Clientes</SelectItem>
                <SelectItem value="products">Produtos</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSearch} disabled={isSearching}>
              <Search className="h-4 w-4 mr-2" />
              {isSearching ? "Buscando..." : "Buscar"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sugestões de busca */}
      {!searchTerm && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium mb-4">Sugestões de busca:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Ordens de Serviço
                </h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>• Número da OS (ex: 02741)</div>
                  <div>• Nome do cliente</div>
                  <div>• Data de criação</div>
                  <div>• Status da OS</div>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Clientes
                </h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>• Nome completo</div>
                  <div>• Número de telefone</div>
                  <div>• CPF ou CNPJ</div>
                  <div>• E-mail</div>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Produtos
                </h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>• Nome do produto</div>
                  <div>• Categoria</div>
                  <div>• Marca</div>
                  <div>• Código do produto</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resultados da busca */}
      {searchResults.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              Resultados da busca ({searchResults.length})
            </h2>
            <Button variant="outline" onClick={() => {
              setSearchTerm("");
              setSearchResults([]);
            }}>
              Limpar busca
            </Button>
          </div>

          {searchResults.map((result) => (
            <Card key={result.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      {getIcon(result.type)}
                      <div>
                        <h3 className="font-medium">{result.title}</h3>
                        <p className="text-sm text-muted-foreground">{result.subtitle}</p>
                      </div>
                      <Badge variant="outline">
                        {getTypeLabel(result.type)}
                      </Badge>
                      {result.status && (
                        <Badge className={getStatusColor(result.status)}>
                          {result.status}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      {Object.entries(result.details).map(([key, value]) => (
                        <div key={key}>
                          <span className="font-medium text-muted-foreground capitalize">
                            {key}:
                          </span>
                          <p>{value}</p>
                        </div>
                      ))}
                    </div>

                    {result.date && (
                      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(result.date).toLocaleDateString('pt-BR')}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Ver detalhes
                    </Button>
                    {result.type === 'os' && (
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {searchTerm && searchResults.length === 0 && !isSearching && (
        <Card>
          <CardContent className="text-center py-8">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium">Nenhum resultado encontrado</p>
            <p className="text-muted-foreground">
              Tente usar termos diferentes ou verifique a ortografia
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
