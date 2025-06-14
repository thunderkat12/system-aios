
import { Users, FileText, History, Package, Calculator, Home, Wrench, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import type { ViewType } from "@/pages/Index";

interface AppSidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const menuItems = [
  {
    title: "Dashboard",
    icon: Home,
    view: "dashboard" as ViewType,
  },
  {
    title: "Cadastro de Clientes",
    icon: Users,
    view: "customers" as ViewType,
  },
  {
    title: "Ordem de Serviço",
    icon: FileText,
    view: "service-orders" as ViewType,
  },
  {
    title: "Histórico",
    icon: History,
    view: "history" as ViewType,
  },
  {
    title: "Controle de Estoque",
    icon: Package,
    view: "stock" as ViewType,
  },
  {
    title: "Central de Orçamento",
    icon: Calculator,
    view: "budget" as ViewType,
  },
  {
    title: "Integrações",
    icon: Settings,
    view: "webhooks" as ViewType,
  },
];

export function AppSidebar({ currentView, onViewChange }: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <Wrench className="h-6 w-6 text-primary" />
          <div>
            <h2 className="font-bold text-sm">Hi-Tech Soluções</h2>
            <p className="text-xs text-muted-foreground">Sistema de Gestão</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.view}>
                  <SidebarMenuButton 
                    onClick={() => onViewChange(item.view)}
                    isActive={currentView === item.view}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
