
import {
  Home,
  Users,
  FileText,
  History,
  Package,
  DollarSign,
  Search,
  CheckCircle,
  Settings,
  UserCog,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuth } from "@/hooks/useAuth"
import { useEmpresaConfig } from "@/hooks/useEmpresaConfig"

export type ViewType = 'dashboard' | 'customers' | 'service-orders' | 'history' | 'stock' | 'budget' | 'search' | 'finalization' | 'webhooks' | 'users' | 'branding-settings' | 'configuracoes';

interface AppSidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const menuItems = [
  {
    title: "Dashboard",
    url: "dashboard",
    icon: Home,
  },
  {
    title: "Clientes",
    url: "customers",
    icon: Users,
  },
  {
    title: "Ordens de Serviço",
    url: "service-orders",
    icon: FileText,
  },
  {
    title: "Histórico",
    url: "history",
    icon: History,
  },
  {
    title: "Estoque",
    url: "stock",
    icon: Package,
  },
  {
    title: "Financeiro",
    url: "budget",
    icon: DollarSign,
  },
  {
    title: "Buscar",
    url: "search",
    icon: Search,
  },
  {
    title: "Finalizar OS",
    url: "finalization",
    icon: CheckCircle,
  },
]

const adminItems = [
  {
    title: "Gestão de Usuários",
    url: "users",
    icon: UserCog,
  },
  {
    title: "Webhooks",
    url: "webhooks",
    icon: Settings,
  },
  {
    title: "Configuração",
    url: "branding-settings",
    icon: Settings,
  },
  {
    title: "Configurações",
    url: "configuracoes",
    icon: Settings,
  },
]

export function AppSidebar({ currentView, onViewChange }: AppSidebarProps) {
  const { userProfile } = useAuth()
  const { config } = useEmpresaConfig();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {config?.nome_empresa || 'Hi-Tech Soluções'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    onClick={() => onViewChange(item.url as ViewType)}
                    isActive={currentView === item.url}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Administração</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    onClick={() => onViewChange(item.url as ViewType)}
                    isActive={currentView === item.url}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
