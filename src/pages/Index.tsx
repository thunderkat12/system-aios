
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
import { useAdminBootstrap } from "@/hooks/useAdminBootstrap";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { BrandingSettings } from "@/components/BrandingSettings";
import Configuracoes from "./Configuracoes";

export type ViewType = 'dashboard' | 'customers' | 'service-orders' | 'history' | 'stock' | 'budget' | 'search' | 'finalization' | 'webhooks' | 'users' | 'branding-settings' | 'configuracoes';

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const { userProfile, isLoading, signOut, isAuthenticated } = useAuth();
  const { config, isLoading: configLoading, hasConfig, loadConfig } = useEmpresaConfig();
  const navigate = useNavigate();

  // Bootstrap admin user
  useAdminBootstrap();

  // Garantir que a empresa seja carregada após login ou reload (corrigir fluxo OAuth e reload)
  useEffect(() => {
    if (isAuthenticated && !configLoading && config === null) {
      loadConfig?.();
    }
  }, [isAuthenticated, configLoading, config, loadConfig]);

  // Corrigir redirecionamento pós-login / OAuth: 
  useEffect(() => {
    if (!isLoading && !configLoading) {
      // Se não autenticado, não faz nada aqui (AuthForm será mostrado)
      if (!isAuthenticated) return;
      // Se autenticado e não tem config, vai para /setup (primeiro acesso)
      if (!hasConfig) {
        if (window.location.pathname !== '/setup') {
          navigate('/setup', { replace: true });
        }
      } else {
        // Se autenticado e já tem config, vai para dashboard
        if (window.location.pathname === '/setup' || window.location.pathname === '/') {
          navigate('/', { replace: true });
        }
      }
    }
  }, [isLoading, configLoading, isAuthenticated, hasConfig, navigate]);

  // Voltar para dashboard principal
  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  // Exibição de loading global enquanto carrega dados essenciais
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

  // Tela de autenticação se não logado
  if (!isAuthenticated) {
    return <AuthForm onAuthSuccess={() => loadConfig?.()} />;
  }

  // Só renderiza conteúdo se houver configuração pronta!
  if (!hasConfig || !config) {
    // Isso cobre o caso "entre login e setup" sem piscar outras telas
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
        return <UserManagement />;
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
