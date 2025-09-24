import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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
}

function SortableWidget({ widget, onRemove }: { widget: DashboardWidgetItem; onRemove: (id: string) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widget.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <DashboardWidget 
        id={widget.id}
        config={widget.config}
        onRemove={onRemove}
        isDragging={isDragging}
      />
    </div>
  );
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
        config: { type: 'stat-card', statType: 'agendamentos' }
      },
      {
        id: 'stat-2', 
        config: { type: 'stat-card', statType: 'leads' }
      },
      {
        id: 'stat-3',
        config: { type: 'stat-card', statType: 'conversao' }
      },
      {
        id: 'stat-4',
        config: { type: 'stat-card', statType: 'ativos' }
      },
      {
        id: 'chart-1',
        config: {
          type: 'chart',
          title: 'Canal de Contato',
          icon: TrendingUp,
          chartType: 'pie',
          variable: 'canal-contato'
        }
      },
      {
        id: 'chart-2',
        config: {
          type: 'chart', 
          title: 'Canal de Agendamento',
          icon: Calendar,
          chartType: 'pie',
          variable: 'canal-agendamento'
        }
      },
      {
        id: 'funnel-1',
        config: { type: 'funnel' }
      },
      {
        id: 'actions-1',
        config: { type: 'actions' }
      }
    ];
    setWidgets(defaultWidgets);
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setWidgets((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleAddWidget = (config: WidgetConfig) => {
    const newWidget: DashboardWidgetItem = {
      id: `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      config,
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

  const getGridCols = (widgetType: string) => {
    switch (widgetType) {
      case 'stat-card':
        return isMobile ? "col-span-1" : "col-span-1 sm:col-span-1 lg:col-span-1";
      case 'chart':
        return isMobile ? "col-span-1" : "col-span-1 lg:col-span-2";
      case 'funnel':
        return "col-span-1 lg:col-span-4";
      case 'actions':
        return "col-span-1 lg:col-span-4";
      default:
        return "col-span-1";
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <div>
          <h1 className={cn("font-bold tracking-tight", isMobile ? "text-2xl" : "text-3xl")}>
            Dashboard Modular
          </h1>
          <p className="text-muted-foreground text-sm lg:text-base">
            Personalize sua visão geral arrastando e organizando os widgets
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Select value={periodo} onValueChange={setPeriodo}>
            <SelectTrigger className={cn(isMobile ? "w-full" : "w-[180px]")}>
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hoje">Hoje</SelectItem>
              <SelectItem value="semana">Esta Semana</SelectItem>
              <SelectItem value="mes">Este Mês</SelectItem>
              <SelectItem value="personalizado">Período Personalizado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Empty State */}
      {widgets.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
          <div className="mx-auto max-w-sm">
            <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Dashboard Vazio</h3>
            <p className="text-muted-foreground mb-4">
              Comece adicionando widgets para personalizar seu dashboard.
            </p>
          </div>
        </div>
      )}

      {/* Drag and Drop Context */}
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={widgets.map(w => w.id)} strategy={verticalListSortingStrategy}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {widgets.map((widget) => (
              <div 
                key={widget.id} 
                className={getGridCols(widget.config.type)}
              >
                <SortableWidget 
                  widget={widget} 
                  onRemove={handleRemoveWidget}
                />
              </div>
            ))}
          </div>
        </SortableContext>
      </DndContext>

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