
import { Card, CardContent } from "@/components/ui/card";
import { Package } from "lucide-react";

interface EmptyStateProps {
  type: 'no-results' | 'no-items';
}

export function StockEmptyState({ type }: EmptyStateProps) {
  if (type === 'no-results') {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium">Nenhum item encontrado</p>
          <p className="text-muted-foreground">
            Tente buscar por outro nome, categoria ou marca
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="text-center py-8">
        <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-lg font-medium">Nenhum item no estoque</p>
        <p className="text-muted-foreground">
          Adicione o primeiro item clicando no botão "Adicionar Item"
        </p>
      </CardContent>
    </Card>
  );
}
