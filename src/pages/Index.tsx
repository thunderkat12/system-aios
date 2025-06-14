
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { UserManagement } from "@/components/UserManagement";
import { AuthForm } from "@/components/AuthForm";
import { useAuth } from "@/hooks/useAuth";
import { useEmpresaConfig } from "@/hooks/useEmpresaConfig";
import { Button } from "@/components/ui/button";
import { LogOut, User, Settings } from "lucide-react";
import { BrandingSettings } from "@/components/BrandingSettings";
import Configuracoes from "./Configuracoes";

export type ViewType = 'dashboard' | 'customers' | 'service-orders' | 'history' | 'stock' | 'budget' | 'search' | 'finalization' | 'webhooks' | 'users' | 'branding-settings' | 'configuracoes';

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const { userProfile, isLoading, signOut, isAuthenticated } = useAuth();
  const { config, isLoading: configLoading, hasConfig } = useEmpresaConfig();
  const navigate = useNavigate();

  useEffect(() => {
    // Se usuário está autenticado mas não tem configuração, redirecionar para setup
    if (isAuthenticated && !configLoading && !hasConfig) {
      navigate('/setup');
    }
  }, [isAuthenticated, configLoading, hasConfig, navigate]);

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  if (isLoading || configLoading) {
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
    return <AuthForm onAuthSuccess={() => setCurrentView('dashboard')} />;
  }

  // Se não tem configuração, não renderizar nada (será redirecionado para /setup)
  if (!hasConfig) {
    return null;
  }

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onViewChange={setCurrentView} />;
      case 'customers':
        return <CustomerForm onBack={handleBackToDashboard} />;
      case 'service-orders':
        return <ServiceOrderForm onBack={handleBackToDashboard} />;
      case 'history':
        return <CustomerHistory />;
      case 'stock':
        return <StockControl />;
      case 'budget':
        return <BudgetCenter />;
      case 'search':
        return <SearchCenter />;
      case 'finalization':
        return <OSFinalization onBack={handleBackToDashboard} />;
      case 'webhooks':
        return <WebhookSettings />;
      case 'users':
        return userProfile?.role === 'admin' ? <UserManagement /> : <Dashboard onViewChange={setCurrentView} />;
      case 'branding-settings':
        return <BrandingSettings onDone={() => setCurrentView('dashboard')} />;
      case 'configuracoes':
        return <Configuracoes onBack={handleBackToDashboard} />;
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
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentView('configuracoes')}
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Configurações
              </Button>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  <strong>{userProfile?.full_name}</strong> ({userProfile?.role})
                </span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={signOut}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </div>
          </div>
          <div className="mb-4 font-extrabold text-2xl text-primary" style={{letterSpacing: '0.5px'}}>
            {config?.nome_empresa || 'Hi-Tech Soluções'}
          </div>
          {renderContent()}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
