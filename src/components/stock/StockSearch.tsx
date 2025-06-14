
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";

interface StockSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAddClick: () => void;
}

export function StockSearch({ searchTerm, onSearchChange, onAddClick }: StockSearchProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome, categoria, marca..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Button onClick={onAddClick}>
        <Plus className="h-4 w-4 mr-2" />
        Adicionar Item
      </Button>
    </div>
  );
}
