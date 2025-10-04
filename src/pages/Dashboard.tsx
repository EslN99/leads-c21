import { useState, useEffect } from "react";
import GridLayout, { Layout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Users,
  TrendingUp,
  Phone,
  Plus,
} from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import DashboardWidget, { WidgetConfig } from "@/components/DashboardWidget";
import WidgetSelector from "@/components/WidgetSelector";

interface DashboardWidgetItem {
  id: string;
  config: WidgetConfig;
  layout?: Layout;
}


export default function Dashboard() {
  const { addLead } = useData();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [periodo, setPeriodo] = useState("mes");
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [widgets, setWidgets] = useState<DashboardWidgetItem[]>([]);
  const [newLead, setNewLead] = useState({
    nome: '',
    telefone: '',
    motivo: '',
    canal: 'Google' as const,
  });

  // Load widgets from localStorage on mount
  useEffect(() => {
    const savedWidgets = localStorage.getItem('dashboard-widgets');
    if (savedWidgets) {
      try {
        const parsed = JSON.parse(savedWidgets);
        setWidgets(parsed);
      } catch (error) {
        console.error('Error loading widgets:', error);
        // Set default widgets if loading fails
        setDefaultWidgets();
      }
    } else {
      setDefaultWidgets();
    }
  }, []);

  // Save widgets to localStorage whenever widgets change
  useEffect(() => {
    if (widgets.length > 0) {
      localStorage.setItem('dashboard-widgets', JSON.stringify(widgets));
    }
  }, [widgets]);

  const setDefaultWidgets = () => {
    const defaultWidgets: DashboardWidgetItem[] = [
      {
        id: 'stat-1',
        config: { type: 'stat-card', statType: 'agendamentos' },
        layout: { i: 'stat-1', x: 0, y: 0, w: 1, h: 1, static: true }
      },
      {
        id: 'stat-2', 
        config: { type: 'stat-card', statType: 'leads' },
        layout: { i: 'stat-2', x: 1, y: 0, w: 1, h: 1, static: true }
      },
      {
        id: 'stat-3',
        config: { type: 'stat-card', statType: 'conversao' },
        layout: { i: 'stat-3', x: 2, y: 0, w: 1, h: 1, static: true }
      },
      {
        id: 'stat-4',
        config: { type: 'stat-card', statType: 'ativos' },
        layout: { i: 'stat-4', x: 3, y: 0, w: 1, h: 1, static: true }
      },
      {
        id: 'chart-1',
        config: {
          type: 'chart',
          title: 'Canal de Contato',
          icon: TrendingUp,
          chartType: 'pie',
          variable: 'canal-contato'
        },
        layout: { i: 'chart-1', x: 0, y: 1, w: 2, h: 2 }
      },
      {
        id: 'chart-2',
        config: {
          type: 'chart', 
          title: 'Canal de Agendamento',
          icon: Calendar,
          chartType: 'pie',
          variable: 'canal-agendamento'
        },
        layout: { i: 'chart-2', x: 2, y: 1, w: 2, h: 2 }
      },
      {
        id: 'funnel-1',
        config: { type: 'funnel' },
        layout: { i: 'funnel-1', x: 0, y: 3, w: 4, h: 2, static: true }
      },
      {
        id: 'actions-1',
        config: { type: 'actions' },
        layout: { i: 'actions-1', x: 0, y: 5, w: 4, h: 1, static: true }
      }
    ];
    setWidgets(defaultWidgets);
  };

  const handleLayoutChange = (newLayout: Layout[]) => {
    setWidgets(prev => prev.map(widget => {
      const layoutItem = newLayout.find(l => l.i === widget.id);
      if (layoutItem) {
        return { ...widget, layout: layoutItem };
      }
      return widget;
    }));
  };

  const handleAddWidget = (config: WidgetConfig) => {
    const newId = `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const maxY = Math.max(...widgets.map(w => (w.layout?.y || 0) + (w.layout?.h || 1)), 0);
    
    let defaultLayout: Layout;
    if (config.type === 'chart') {
      defaultLayout = { i: newId, x: 0, y: maxY, w: 2, h: 2 };
    } else if (config.type === 'stat-card') {
      defaultLayout = { i: newId, x: 0, y: maxY, w: 1, h: 1, static: true };
    } else {
      defaultLayout = { i: newId, x: 0, y: maxY, w: 4, h: 2, static: true };
    }
    
    const newWidget: DashboardWidgetItem = {
      id: newId,
      config,
      layout: defaultLayout,
    };
    setWidgets(prev => [...prev, newWidget]);
    toast.success("Widget adicionado com sucesso!");
  };

  const handleRemoveWidget = (id: string) => {
    setWidgets(prev => prev.filter(widget => widget.id !== id));
    toast.success("Widget removido com sucesso!");
  };


  const handleAddLead = () => {
    if (!newLead.nome || !newLead.telefone || !newLead.motivo) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    addLead({
      ...newLead,
      dataContato: new Date().toISOString().split('T')[0],
      statusContato: '1º Consulta',
      agendamento: 'Não',
      tipoConsulta: 'Outros',
      objecao: 'Nenhuma',
      followUp: 'Outro',
      kanbanStatus: 'inicio',
      prioridade: 'media',
    });

    setNewLead({ nome: '', telefone: '', motivo: '', canal: 'Google' });
    setIsAddLeadOpen(false);
    toast.success("Lead adicionado com sucesso!");
  };


  return (
    <div className={cn("space-y-4 relative", isMobile ? "space-y-3" : "space-y-6")}>
      {/* Header */}
      <div className={cn(
        "flex flex-col gap-3 justify-between",
        isMobile ? "space-y-3" : "md:flex-row md:items-center md:gap-4"
      )}>
        <div className="min-w-0 flex-1">
          <h1 className={cn(
            "font-bold tracking-tight gradient-text", 
            isMobile ? "text-xl" : "text-2xl lg:text-3xl"
          )}>
            Dashboard Modular
          </h1>
          <p className={cn(
            "text-muted-foreground mt-1", 
            isMobile ? "text-xs" : "text-sm lg:text-base"
          )}>
            {isMobile 
              ? "Personalize com widgets arrastar e soltar" 
              : "Personalize sua visão geral arrastando e organizando os widgets"
            }
          </p>
        </div>
        
        <div className={cn("flex items-center gap-3", isMobile && "flex-col w-full")}>
          <Select value={periodo} onValueChange={setPeriodo}>
            <SelectTrigger className={cn(isMobile ? "w-full" : "w-[140px] lg:w-[180px]")}>
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hoje">Hoje</SelectItem>
              <SelectItem value="semana">Esta Semana</SelectItem>
              <SelectItem value="mes">Este Mês</SelectItem>
              <SelectItem value="personalizado">Personalizado</SelectItem>
            </SelectContent>
          </Select>
          
          {!isMobile && (
            <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg text-xs text-muted-foreground">
              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
              {widgets.length} widgets ativos
            </div>
          )}
        </div>
      </div>

      {/* Empty State */}
      {widgets.length === 0 && (
        <div className={cn(
          "text-center border-2 border-dashed border-border rounded-xl bg-muted/20",
          isMobile ? "py-8 px-4" : "py-12 px-6"
        )}>
          <div className="mx-auto max-w-sm">
            <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto mb-4">
              <TrendingUp className={cn("text-primary", isMobile ? "h-8 w-8" : "h-12 w-12")} />
            </div>
            <h3 className={cn("font-semibold mb-2", isMobile ? "text-base" : "text-lg")}>
              Dashboard Vazio
            </h3>
            <p className={cn("text-muted-foreground mb-4", isMobile ? "text-xs" : "text-sm")}>
              {isMobile 
                ? "Toque no + para adicionar widgets" 
                : "Comece adicionando widgets para personalizar seu dashboard"
              }
            </p>
            {isMobile && (
              <div className="text-xs text-primary bg-primary/10 px-3 py-1 rounded-full inline-block">
                Botão + no canto inferior direito
              </div>
            )}
          </div>
        </div>
      )}

      {/* Grid Layout */}
      {!isMobile ? (
        <GridLayout
          className="layout"
          layout={widgets.map(w => w.layout || { i: w.id, x: 0, y: 0, w: 2, h: 2 })}
          cols={4}
          rowHeight={150}
          width={1200}
          onLayoutChange={handleLayoutChange}
          isDraggable={true}
          isResizable={true}
          compactType="vertical"
          preventCollision={false}
          resizeHandles={['se']}
        >
          {widgets.map((widget) => (
            <div 
              key={widget.id} 
              className="grid-item"
              data-grid={{
                ...widget.layout,
                static: widget.config.type !== 'chart'
              }}
            >
              <DashboardWidget 
                id={widget.id}
                config={widget.config}
                onRemove={handleRemoveWidget}
                isDragging={false}
              />
            </div>
          ))}
        </GridLayout>
      ) : (
        <div className="space-y-3">
          {widgets.map((widget) => (
            <DashboardWidget 
              key={widget.id}
              id={widget.id}
              config={widget.config}
              onRemove={handleRemoveWidget}
              isDragging={false}
            />
          ))}
        </div>
      )}

      {/* Quick Add Lead Dialog (preserved for compatibility) */}
      <Dialog open={isAddLeadOpen} onOpenChange={setIsAddLeadOpen}>
        <DialogContent className={cn(isMobile && "w-[95vw] h-[90vh] max-w-none")}>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Lead</DialogTitle>
          </DialogHeader>
          <div className={cn("space-y-4", isMobile && "max-h-[70vh] overflow-y-auto")}>
            <div>
              <Label htmlFor="nome">Nome *</Label>
              <Input
                id="nome"
                value={newLead.nome}
                onChange={(e) => setNewLead(prev => ({ ...prev, nome: e.target.value }))}
                placeholder="Nome completo"
              />
            </div>
            <div>
              <Label htmlFor="telefone">Telefone *</Label>
              <Input
                id="telefone"
                value={newLead.telefone}
                onChange={(e) => setNewLead(prev => ({ ...prev, telefone: e.target.value }))}
                placeholder="(11) 99999-9999"
              />
            </div>
            <div>
              <Label htmlFor="motivo">Motivo da Consulta *</Label>
              <Input
                id="motivo"
                value={newLead.motivo}
                onChange={(e) => setNewLead(prev => ({ ...prev, motivo: e.target.value }))}
                placeholder="Descreva o motivo"
              />
            </div>
            <div>
              <Label htmlFor="canal">Canal de Contato</Label>
              <Select 
                value={newLead.canal} 
                onValueChange={(value: any) => setNewLead(prev => ({ ...prev, canal: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Google">Google</SelectItem>
                  <SelectItem value="Instagram">Instagram</SelectItem>
                  <SelectItem value="YouTube">YouTube</SelectItem>
                  <SelectItem value="Indicação">Indicação</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className={cn("flex gap-2", isMobile ? "flex-col" : "")}>
              <Button onClick={handleAddLead} className="flex-1">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar
              </Button>
              <Button variant="outline" onClick={() => setIsAddLeadOpen(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Widget Selector - Floating Add Button */}
      <WidgetSelector onAddWidget={handleAddWidget} />
    </div>
  );
}