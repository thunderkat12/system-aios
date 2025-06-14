
import { useState } from "react";
import { Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useStockData } from "@/hooks/useStockData";
import { StockStats } from "./stock/StockStats";
import { StockSearch } from "./stock/StockSearch";
import { StockForm } from "./stock/StockForm";
import { StockItem } from "./stock/StockItem";
import { StockEmptyState } from "./stock/StockEmptyStates";

export function StockControl() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const { stockItems, isLoading, addStockItem, updateStockItem, deleteStockItem } = useStockData();
  const { toast } = useToast();

  const filteredItems = stockItems.filter(item =>
    item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.categoria && item.categoria.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.marca && item.marca.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddItem = async (formData: any) => {
    const { error } = await addStockItem({
      nome: formData.nome,
      categoria: formData.categoria || null,
      marca: formData.marca || null,
      quantidade: parseInt(formData.quantidade),
      estoque_minimo: parseInt(formData.estoque_minimo),
      valor_unitario: formData.valor_unitario ? parseFloat(formData.valor_unitario) : null
    });

    if (error) {
      toast({
        title: "Erro",
        description: "Falha ao adicionar item ao estoque",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Item adicionado!",
      description: `${formData.nome} foi adicionado ao estoque`,
    });

    resetForm();
  };

  const handleEditItem = (item: any) => {
    setEditingItem(item);
    setShowAddForm(true);
  };

  const handleUpdateItem = async (formData: any) => {
    if (!editingItem) return;

    const { error } = await updateStockItem(editingItem.id, {
      nome: formData.nome,
      categoria: formData.categoria || null,
      marca: formData.marca || null,
      quantidade: parseInt(formData.quantidade),
      estoque_minimo: parseInt(formData.estoque_minimo),
      valor_unitario: formData.valor_unitario ? parseFloat(formData.valor_unitario) : null
    });

    if (error) {
      toast({
        title: "Erro",
        description: "Falha ao atualizar item do estoque",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Item atualizado!",
      description: `${formData.nome} foi atualizado com sucesso`,
    });

    resetForm();
  };

  const handleDeleteItem = async (itemId: string) => {
    const item = stockItems.find(item => item.id === itemId);
    
    const { error } = await deleteStockItem(itemId);

    if (error) {
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
  };

  const resetForm = () => {
    setShowAddForm(false);
    setEditingItem(null);
  };

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

      <StockStats stockItems={stockItems} />

      <StockSearch 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddClick={() => setShowAddForm(!showAddForm)}
      />

      {showAddForm && (
        <StockForm
          editingItem={editingItem}
          onSubmit={editingItem ? handleUpdateItem : handleAddItem}
          onCancel={resetForm}
        />
      )}

      <div className="space-y-4">
        {filteredItems.map((item) => (
          <StockItem
            key={item.id}
            item={item}
            onEdit={handleEditItem}
            onDelete={handleDeleteItem}
          />
        ))}
      </div>

      {filteredItems.length === 0 && searchTerm && (
        <StockEmptyState type="no-results" />
      )}

      {stockItems.length === 0 && !isLoading && (
        <StockEmptyState type="no-items" />
      )}
    </div>
  );
}
