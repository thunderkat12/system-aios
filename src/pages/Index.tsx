
import { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Dashboard } from "@/components/Dashboard";
import { CustomerForm } from "@/components/CustomerForm";
import { ServiceOrderForm } from "@/components/ServiceOrderForm";
import { CustomerHistory } from "@/components/CustomerHistory";
import { StockControl } from "@/components/StockControl";
import { BudgetCenter } from "@/components/BudgetCenter";
import { SearchCenter } from "@/components/SearchCenter";
import { OSFinalization } from "@/components/OSFinalization";
import { WebhookSettings } from "@/components/WebhookSettings";
import { Login } from "@/components/Login";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export type ViewType = 'dashboard' | 'customers' | 'service-orders' | 'history' | 'stock' | 'budget' | 'search' | 'finalization' | 'webhooks';

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const { isAuthenticated, isLoading, login, logout, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando sistema...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLogin={login} />;
  }

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onViewChange={setCurrentView} />;
      case 'customers':
        return <CustomerForm />;
      case 'service-orders':
        return <ServiceOrderForm />;
      case 'history':
        return <CustomerHistory />;
      case 'stock':
        return <StockControl />;
      case 'budget':
        return <BudgetCenter />;
      case 'search':
        return <SearchCenter />;
      case 'finalization':
        return <OSFinalization />;
      case 'webhooks':
        return <WebhookSettings />;
      default:
        return <Dashboard onViewChange={setCurrentView} />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar currentView={currentView} onViewChange={setCurrentView} />
        <main className="flex-1 p-4">
          <div className="mb-4 flex items-center justify-between">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Conectado como: <strong>{user}</strong>
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={logout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </div>
          </div>
          {renderContent()}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
