import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  BarChart3,
  Users,
  Kanban,
  Settings,
  TrendingUp,
  ChevronDown,
  Home,
  Calendar,
  Phone,
} from "lucide-react";
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
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useData } from "@/contexts/DataContext";

const mainNavigation = [
  { 
    title: "Dashboard", 
    url: "/", 
    icon: Home,
    description: "Visão geral"
  },
  { 
    title: "Leads", 
    url: "/leads", 
    icon: Users,
    description: "Gestão de leads"
  },
  { 
    title: "CRM Kanban", 
    url: "/crm", 
    icon: Kanban,
    description: "Pipeline de vendas"
  },
];

const systemNavigation = [
  { 
    title: "Configurações", 
    url: "/settings", 
    icon: Settings,
    description: "Ajustes do sistema"
  },
];

export function AppSidebar() {
  const { state, isMobile } = useSidebar();
  const location = useLocation();
  const { getStats } = useData();
  const stats = getStats();
  
  const currentPath = location.pathname;
  const isActive = (path: string) => currentPath === path;
  const collapsed = state === "collapsed";
  
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    cn(
      "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
      isActive
        ? "bg-primary text-primary-foreground shadow-md"
        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
    );

  return (
    <Sidebar className={cn("border-r border-sidebar-border", collapsed ? "w-16" : "w-64")}>
      {/* Header */}
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <div className="p-2 bg-primary/10 rounded-lg">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <h1 className="font-bold text-lg text-sidebar-foreground">C21 CRM</h1>
              <p className="text-xs text-sidebar-foreground/60 truncate">
                Consultório 21
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="py-4">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider mb-2">
            {!collapsed ? "Principal" : ""}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 px-2">
              {mainNavigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="p-0">
                    <NavLink 
                      to={item.url} 
                      end 
                      className={getNavCls({ isActive: isActive(item.url) })}
                      title={collapsed ? item.title : ""}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && (
                        <div className="flex-1 min-w-0">
                          <span className="block truncate">{item.title}</span>
                          <span className="text-xs opacity-60 truncate block">
                            {item.description}
                          </span>
                        </div>
                      )}
                      {!collapsed && item.url === "/" && (
                        <Badge 
                          variant="secondary" 
                          className="ml-auto bg-primary/10 text-primary text-xs"
                        >
                          {stats.novosLeads}
                        </Badge>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Stats - Only show when expanded */}
        {!collapsed && (
          <SidebarGroup>
            <SidebarGroupLabel className="px-3 text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider mb-2">
              Estatísticas
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="px-2 space-y-2">
                <div className="p-3 bg-sidebar-accent rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Agendamentos</span>
                    </div>
                    <Badge className="bg-primary/20 text-primary border-primary/30">
                      {stats.totalAgendamentos}
                    </Badge>
                  </div>
                </div>
                <div className="p-3 bg-sidebar-accent rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-chart-2" />
                      <span className="text-sm font-medium">Leads Ativos</span>
                    </div>
                    <Badge className="bg-chart-2/20 text-chart-2 border-chart-2/30">
                      {stats.leadsAtivos}
                    </Badge>
                  </div>
                </div>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* System Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider mb-2">
            {!collapsed ? "Sistema" : ""}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 px-2">
              {systemNavigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="p-0">
                    <NavLink 
                      to={item.url} 
                      className={getNavCls({ isActive: isActive(item.url) })}
                      title={collapsed ? item.title : ""}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && (
                        <div className="flex-1 min-w-0">
                          <span className="block truncate">{item.title}</span>
                          <span className="text-xs opacity-60 truncate block">
                            {item.description}
                          </span>
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="p-4 border-t border-sidebar-border">
        {!collapsed ? (
          <div className="text-center">
            <p className="text-xs text-sidebar-foreground/50">
              © 2024 Consultório 21
            </p>
            <p className="text-xs text-sidebar-foreground/30 mt-1">
              v2.0 - Sistema CRM
            </p>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}