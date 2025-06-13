
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Package, Plus, AlertTriangle, Search, Edit, Trash2 } from "lucide-react";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { supabase } from '@/integrations/supabase/client';
import { ActivityLogger } from './ActivityLogger';

interface StockItem {
  id: string;
  nome: string;
  categoria: string | null;
  marca: string | null;
  quantidade: number;
  estoque_minimo: number | null;
  valor_unitario: number | null;
  status?: string;
}

export function StockControl() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<StockItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [newItem, setNewItem] = useState({
    nome: "",
    categoria: "",
    marca: "",
    quantidade: "",
    estoque_minimo: "",
    valor_unitario: ""
  });
  const { toast } = useToast();

  // Carregar dados do estoque do Supabase
  const fetchStockItems = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('estoque')
        .select('*')
        .order('nome');

      if (error) {
        console.error('Erro ao buscar estoque:', error);
        toast({
          title: "Erro",
          description: "Falha ao carregar dados do estoque",
          variant: "destructive",
        });
        return;
      }

      setStockItems(data || []);
    } catch (error) {
      console.error('Erro ao buscar estoque:', error);
      toast({
        title: "Erro",
        description: "Falha ao conectar com o banco de dados",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStockItems();
  }, []);

  const filteredItems = stockItems.filter(item =>
    item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.categoria && item.categoria.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.marca && item.marca.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const calculateStatus = (quantidade: number, estoqueMinimo: number | null) => {
    if (quantidade === 0) return "Esgotado";
    if (estoqueMinimo && quantidade <= estoqueMinimo) return "Baixo";
    return "Normal";
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newItem.nome || !newItem.quantidade || !newItem.estoque_minimo) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('estoque')
        .insert({
          nome: newItem.nome,
          categoria: newItem.categoria || null,
          marca: newItem.marca || null,
          quantidade: parseInt(newItem.quantidade),
          estoque_minimo: parseInt(newItem.estoque_minimo),
          valor_unitario: newItem.valor_unitario ? parseFloat(newItem.valor_unitario) : null
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao adicionar item:', error);
        toast({
          title: "Erro",
          description: "Falha ao adicionar item ao estoque",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Item adicionado!",
        description: `${newItem.nome} foi adicionado ao estoque`,
      });

      // Atualizar lista local
      await fetchStockItems();
      resetForm();

      // Registrar atividade se estoque baixo
      const quantidade = parseInt(newItem.quantidade);
      const minimo = parseInt(newItem.estoque_minimo);
      if (quantidade <= minimo) {
        await ActivityLogger.logLowStock(newItem.nome, quantidade);
      }
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
      toast({
        title: "Erro",
        description: "Falha ao conectar com o banco de dados",
        variant: "destructive",
      });
    }
  };

  const handleEditItem = (item: StockItem) => {
    setEditingItem(item);
    setNewItem({
      nome: item.nome,
      categoria: item.categoria || "",
      marca: item.marca || "",
      quantidade: item.quantidade.toString(),
      estoque_minimo: item.estoque_minimo?.toString() || "",
      valor_unitario: item.valor_unitario?.toString() || ""
    });
    setShowAddForm(true);
  };

  const handleUpdateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newItem.nome || !newItem.quantidade || !newItem.estoque_minimo || !editingItem) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('estoque')
        .update({
          nome: newItem.nome,
          categoria: newItem.categoria || null,
          marca: newItem.marca || null,
          quantidade: parseInt(newItem.quantidade),
          estoque_minimo: parseInt(newItem.estoque_minimo),
          valor_unitario: newItem.valor_unitario ? parseFloat(newItem.valor_unitario) : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingItem.id);

      if (error) {
        console.error('Erro ao atualizar item:', error);
        toast({
          title: "Erro",
          description: "Falha ao atualizar item do estoque",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Item atualizado!",
        description: `${newItem.nome} foi atualizado com sucesso`,
      });

      // Atualizar lista local
      await fetchStockItems();
      resetForm();

      // Registrar atividade se estoque baixo
      const quantidade = parseInt(newItem.quantidade);
      const minimo = parseInt(newItem.estoque_minimo);
      if (quantidade <= minimo) {
        await ActivityLogger.logLowStock(newItem.nome, quantidade);
      }
    } catch (error) {
      console.error('Erro ao atualizar item:', error);
      toast({
        title: "Erro",
        description: "Falha ao conectar com o banco de dados",
        variant: "destructive",
      });
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      const item = stockItems.find(item => item.id === itemId);
      
      const { error } = await supabase
        .from('estoque')
        .delete()
        .eq('id', itemId);

      if (error) {
        console.error('Erro ao excluir item:', error);
        toast({
          title: "Erro",
          description: "Falha ao excluir item do estoque",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Item excluído!",
        description: `${item?.nome} foi removido do estoque`,
      });

      // Atualizar lista local
      await fetchStockItems();
    } catch (error) {
      console.error('Erro ao excluir item:', error);
      toast({
        title: "Erro",
        description: "Falha ao conectar com o banco de dados",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setNewItem({
      nome: "",
      categoria: "",
      marca: "",
      quantidade: "",
      estoque_minimo: "",
      valor_unitario: ""
    });
    setShowAddForm(false);
    setEditingItem(null);
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

  // Calcular estatísticas
  const lowStockCount = stockItems.filter(item => {
    const status = calculateStatus(item.quantidade, item.estoque_minimo);
    return status === "Baixo" || status === "Esgotado";
  }).length;

  const totalValue = stockItems.reduce((sum, item) => {
    if (item.valor_unitario) {
      return sum + (item.valor_unitario * item.quantidade);
    }
    return sum;
  }, 0);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
            <Package className="h-8 w-8" />
            Controle de Estoque
          </h1>
          <p className="text-muted-foreground">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
          <Package className="h-8 w-8" />
          Controle de Estoque
        </h1>
        <p className="text-muted-foreground">
          Cadastro de peças com aviso de baixo estoque
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
            <div className="text-2xl font-bold">R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground">Valor em estoque</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, categoria, marca..."
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
            <CardTitle>{editingItem ? "Editar Item" : "Adicionar Novo Item"}</CardTitle>
            <CardDescription>
              {editingItem ? "Atualize as informações da peça" : "Cadastre uma nova peça no estoque"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={editingItem ? handleUpdateItem : handleAddItem} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="itemName">Nome da Peça *</Label>
                  <Input
                    id="itemName"
                    placeholder="Ex: Tela 15.6 Full HD"
                    value={newItem.nome}
                    onChange={(e) => setNewItem(prev => ({ ...prev, nome: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Input
                    id="category"
                    placeholder="Ex: Telas, Teclados, etc."
                    value={newItem.categoria}
                    onChange={(e) => setNewItem(prev => ({ ...prev, categoria: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">Marca</Label>
                  <Input
                    id="brand"
                    placeholder="Ex: Dell, Samsung, etc."
                    value={newItem.marca}
                    onChange={(e) => setNewItem(prev => ({ ...prev, marca: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valorUnitario">Valor Unitário</Label>
                  <Input
                    id="valorUnitario"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={newItem.valor_unitario}
                    onChange={(e) => setNewItem(prev => ({ ...prev, valor_unitario: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantidade *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={newItem.quantidade}
                    onChange={(e) => setNewItem(prev => ({ ...prev, quantidade: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minQuantity">Estoque Mínimo *</Label>
                  <Input
                    id="minQuantity"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={newItem.estoque_minimo}
                    onChange={(e) => setNewItem(prev => ({ ...prev, estoque_minimo: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit">
                  {editingItem ? "Atualizar Item" : "Adicionar Item"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {filteredItems.map((item) => {
          const status = calculateStatus(item.quantidade, item.estoque_minimo);
          return (
            <Card key={item.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium">{item.nome}</h3>
                      <Badge className={getStatusColor(status)}>
                        {status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">Categoria:</span> {item.categoria || "N/A"}
                      </div>
                      <div>
                        <span className="font-medium">Marca:</span> {item.marca || "N/A"}
                      </div>
                      <div>
                        <span className="font-medium">Quantidade:</span> {item.quantidade}
                      </div>
                      <div>
                        <span className="font-medium">Mínimo:</span> {item.estoque_minimo || "N/A"}
                      </div>
                      <div>
                        <span className="font-medium">Valor Unit.:</span> {item.valor_unitario ? `R$ ${item.valor_unitario.toFixed(2)}` : "N/A"}
                      </div>
                      <div>
                        <span className="font-medium">Valor Total:</span> {item.valor_unitario ? `R$ ${(item.valor_unitario * item.quantidade).toFixed(2)}` : "N/A"}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditItem(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir "{item.nome}"? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteItem(item.id)}>
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredItems.length === 0 && searchTerm && (
        <Card>
          <CardContent className="text-center py-8">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium">Nenhum item encontrado</p>
            <p className="text-muted-foreground">
              Tente buscar por outro nome, categoria ou marca
            </p>
          </CardContent>
        </Card>
      )}

      {stockItems.length === 0 && !isLoading && (
        <Card>
          <CardContent className="text-center py-8">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium">Nenhum item no estoque</p>
            <p className="text-muted-foreground">
              Adicione o primeiro item clicando no botão "Adicionar Item"
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
