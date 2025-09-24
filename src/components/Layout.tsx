import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export default function Layout() {
  const isMobile = useIsMobile();

  return (
    <SidebarProvider 
      defaultOpen={!isMobile}
    >
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="h-14 flex items-center justify-between px-4 bg-background border-b border-border shrink-0">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="hover:bg-accent hover:text-accent-foreground" />
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-foreground">Sistema de Gestão Clínica</p>
                <p className="text-xs text-muted-foreground">Consultório 21 - CRM Avançado</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-medium">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                Online
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className={cn(
            "flex-1 overflow-y-auto",
            isMobile ? "p-3" : "p-4 lg:p-6"
          )}>
            <div className="mx-auto max-w-7xl">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}