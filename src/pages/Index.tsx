
import { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Dashboard } from "@/components/Dashboard";
import { CustomerForm } from "@/components/CustomerForm";
import { ServiceOrderForm } from "@/components/ServiceOrderForm";
import { CustomerHistory } from "@/components/CustomerHistory";
import { StockControl } from "@/components/StockControl";
import { BudgetCenter } from "@/components/BudgetCenter";

export type ViewType = 'dashboard' | 'customers' | 'service-orders' | 'history' | 'stock' | 'budget';

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
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
      default:
        return <Dashboard />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar currentView={currentView} onViewChange={setCurrentView} />
        <main className="flex-1 p-4">
          <div className="mb-4">
            <SidebarTrigger />
          </div>
          {renderContent()}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
