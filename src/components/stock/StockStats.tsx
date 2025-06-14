
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, AlertTriangle } from "lucide-react";
import { StockItem } from "@/hooks/useStockData";

interface StockStatsProps {
  stockItems: StockItem[];
}

export function StockStats({ stockItems }: StockStatsProps) {
  const calculateStatus = (quantidade: number, estoqueMinimo: number | null) => {
    if (quantidade === 0) return "Esgotado";
    if (estoqueMinimo && quantidade <= estoqueMinimo) return "Baixo";
    return "Normal";
  };

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

  return (
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
  );
}
