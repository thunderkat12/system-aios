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
import { useBranding } from "@/hooks/useBranding"

export type ViewType = 'dashboard' | 'customers' | 'service-orders' | 'history' | 'stock' | 'budget' | 'search' | 'finalization' | 'webhooks' | 'users' | 'branding-settings';

interface AppSidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const menuItems = [
  {
    title: "Dashboard",
    url: "dashboard",
    icon: Home,
    roles: ['admin', 'tecnico', 'atendente']
  },
  {
    title: "Clientes",
    url: "customers",
    icon: Users,
    roles: ['admin', 'atendente']
  },
  {
    title: "Ordens de Serviço",
    url: "service-orders",
    icon: FileText,
    roles: ['admin', 'tecnico', 'atendente']
  },
  {
    title: "Histórico",
    url: "history",
    icon: History,
    roles: ['admin', 'tecnico', 'atendente']
  },
  {
    title: "Estoque",
    url: "stock",
    icon: Package,
    roles: ['admin', 'atendente']
  },
  {
    title: "Financeiro",
    url: "budget",
    icon: DollarSign,
    roles: ['admin']
  },
  {
    title: "Buscar",
    url: "search",
    icon: Search,
    roles: ['admin', 'tecnico', 'atendente']
  },
  {
    title: "Finalizar OS",
    url: "finalization",
    icon: CheckCircle,
    roles: ['admin', 'tecnico']
  },
]

const adminItems = [
  {
    title: "Gestão de Usuários",
    url: "users",
    icon: UserCog,
    roles: ['admin']
  },
  {
    title: "Webhooks",
    url: "webhooks",
    icon: Settings,
    roles: ['admin']
  },
  {
    title: "Configuração",
    url: "branding-settings",
    icon: Settings,
    roles: ['admin']
  },
]

export function AppSidebar({ currentView, onViewChange }: AppSidebarProps) {
  const { userProfile } = useAuth()
  const { branding } = useBranding();

  const hasAccess = (roles: string[]) => {
    return userProfile && roles.includes(userProfile.role)
  }

  const filteredMenuItems = menuItems.filter(item => hasAccess(item.roles))
  const filteredAdminItems = adminItems.filter(item => hasAccess(item.roles))

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {branding.appName}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMenuItems.map((item) => (
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
        {filteredAdminItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Administração</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredAdminItems.map((item) => (
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
        )}
      </SidebarContent>
    </Sidebar>
  )
}
