import { useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { 
  BarChart3, 
  Users, 
  Kanban, 
  Menu,
  X,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Leads", href: "/leads", icon: Users },
  { name: "CRM Kanban", href: "/crm", icon: Kanban },
];

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-primary/20 backdrop-blur-sm" />
        </div>
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-primary transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 flex flex-col",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex h-20 shrink-0 items-center justify-between px-6 border-b border-primary-hover">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-8 w-8 text-secondary" />
            <span className="text-xl font-bold text-primary-foreground">
              C21 CRM
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden text-primary-foreground hover:bg-primary-hover"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 px-4 py-6 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-secondary text-secondary-foreground shadow-sm"
                    : "text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-hover"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-primary-hover p-4 mt-auto">
          <p className="text-xs text-primary-foreground/50">
            © 2024 Consultório 21
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 lg:ml-0 min-h-0">
        {/* Top bar */}
        <div className="flex h-20 shrink-0 items-center justify-between px-6 bg-background border-b border-border">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="text-sm text-muted-foreground lg:block hidden">
              Sistema de Gestão Clínica
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}