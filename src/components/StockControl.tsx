
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Package, Plus, AlertTriangle, Search, Edit, Trash2 } from "lucide-react";

export function StockControl() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    quantity: "",
    minQuantity: "",
    price: ""
  });
  const { toast } = useToast();

  // Dados mockados para demonstração
  const stockItems = [
    {
      id: 1,
      name: "Tela 15.6\" Full HD",
      category: "Telas",
      quantity: 2,
      minQuantity: 5,
      price: "R$ 280,00",
      status: "Baixo"
    },
    {
      id: 2,
      name: "Teclado ABNT2 Notebook",
      category: "Teclados",
      quantity: 8,
      minQuantity: 3,
      price: "R$ 85,00",
      status: "Normal"
    },
    {
      id: 3,
      name: "HD 1TB Seagate",
      category: "Armazenamento",
      quantity: 1,
      minQuantity: 2,
      price: "R$ 320,00",
      status: "Baixo"
    },
    {
      id: 4,
      name: "SSD 256GB Kingston",
      category: "Armazenamento",
      quantity: 6,
      minQuantity: 3,
      price: "R$ 180,00",
      status: "Normal"
    },
    {
      id: 5,
      name: "Memória RAM 8GB DDR4",
      category: "Memórias",
      quantity: 0,
      minQuantity: 4,
      price: "R$ 220,00",
      status: "Esgotado"
    }
  ];

  const filteredItems = stockItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newItem.name || !newItem.quantity || !newItem.minQuantity || !newItem.price) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Item adicionado!",
      description: `${newItem.name} foi adicionado ao estoque`,
    });

    setNewItem({
      name: "",
      category: "",
      quantity: "",
      minQuantity: "",
      price: ""
    });
    setShowAddForm(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Esgotado":
        return "bg-red-100 text-red-800";
      case "Baixo":
        return "bg-yellow-100 text-yellow-800";
      case "Normal":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const lowStockCount = stockItems.filter(item => item.status === "Baixo" || item.status === "Esgotado").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
          <Package className="h-8 w-8" />
          Controle de Estoque
        </h1>
        <p className="text-muted-foreground">
          Cadastro de peças com aviso de baixo estoque (Beta)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Itens</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stockItems.length}</div>
            <p className="text-xs text-muted-foreground">Tipos de peças</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{lowStockCount}</div>
            <p className="text-xs text-muted-foreground">Itens para repor</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 5.420</div>
            <p className="text-xs text-muted-foreground">Estimativa</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar peças..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Item
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Adicionar Novo Item</CardTitle>
            <CardDescription>Cadastre uma nova peça no estoque</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddItem} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="itemName">Nome da Peça *</Label>
                  <Input
                    id="itemName"
                    placeholder="Ex: Tela 15.6 Full HD"
                    value={newItem.name}
                    onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Input
                    id="category"
                    placeholder="Ex: Telas, Teclados, etc."
                    value={newItem.category}
                    onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantidade *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="0"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem(prev => ({ ...prev, quantity: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minQuantity">Estoque Mínimo *</Label>
                  <Input
                    id="minQuantity"
                    type="number"
                    placeholder="0"
                    value={newItem.minQuantity}
                    onChange={(e) => setNewItem(prev => ({ ...prev, minQuantity: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Preço *</Label>
                  <Input
                    id="price"
                    placeholder="R$ 0,00"
                    value={newItem.price}
                    onChange={(e) => setNewItem(prev => ({ ...prev, price: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit">Adicionar Item</Button>
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {filteredItems.map((item) => (
          <Card key={item.id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium">{item.name}</h3>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium">Categoria:</span> {item.category}
                    </div>
                    <div>
                      <span className="font-medium">Quantidade:</span> {item.quantity}
                    </div>
                    <div>
                      <span className="font-medium">Mínimo:</span> {item.minQuantity}
                    </div>
                    <div>
                      <span className="font-medium">Preço:</span> {item.price}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && searchTerm && (
        <Card>
          <CardContent className="text-center py-8">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium">Nenhum item encontrado</p>
            <p className="text-muted-foreground">
              Tente buscar por outro nome ou categoria
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
