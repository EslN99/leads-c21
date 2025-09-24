import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Calendar,
  Users,
  TrendingUp,
  Phone,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  Filter,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { WidgetConfig } from "./DashboardWidget";

const widgetTypes = [
  {
    type: 'stat-card' as const,
    name: 'Cartão de Estatística',
    description: 'Métricas importantes com comparação',
    icon: TrendingUp,
    color: 'bg-primary/10 text-primary border-primary/20',
  },
  {
    type: 'chart' as const,
    name: 'Gráfico Interativo',
    description: 'Visualizações personalizáveis dos dados',
    icon: BarChart3,
    color: 'bg-chart-1/10 text-chart-1 border-chart-1/20',
  },
  {
    type: 'funnel' as const,
    name: 'Funil de Conversão',
    description: 'Pipeline de vendas do kanban',
    icon: Filter,
    color: 'bg-chart-2/10 text-chart-2 border-chart-2/20',
  },
  {
    type: 'actions' as const,
    name: 'Ações Rápidas',
    description: 'Botões para ações frequentes',
    icon: Menu,
    color: 'bg-chart-3/10 text-chart-3 border-chart-3/20',
  },
];

const statCardTypes = [
  { value: 'agendamentos', label: 'Total de Agendamentos', icon: Calendar },
  { value: 'leads', label: 'Novos Leads', icon: Users },
  { value: 'conversao', label: 'Taxa de Conversão', icon: TrendingUp },
  { value: 'ativos', label: 'Leads Ativos', icon: Phone },
];

const chartTypes = [
  { value: 'pie', label: 'Pizza', icon: PieChart },
  { value: 'bar', label: 'Barras', icon: BarChart3 },
  { value: 'line', label: 'Linha', icon: LineChart },
  { value: 'area', label: 'Área', icon: Activity },
];

const chartIcons = [
  { value: 'TrendingUp', label: 'Tendência', icon: TrendingUp },
  { value: 'BarChart3', label: 'Gráfico de Barras', icon: BarChart3 },
  { value: 'Users', label: 'Usuários', icon: Users },
  { value: 'Calendar', label: 'Calendário', icon: Calendar },
  { value: 'Phone', label: 'Telefone', icon: Phone },
];

const dataVariables = [
  { value: 'canal', label: 'Canal de Contato (Todos)' },
  { value: 'canal-contato', label: 'Canal de Contato' },
  { value: 'canal-agendamento', label: 'Canal de Agendamento' },
  { value: 'objecao', label: 'Objeções' },
  { value: 'status', label: 'Status do Contato' },
  { value: 'tipo-consulta', label: 'Tipo de Consulta' },
  { value: 'follow-up', label: 'Follow-up' },
];

interface WidgetSelectorProps {
  onAddWidget: (config: WidgetConfig) => void;
}

export default function WidgetSelector({ onAddWidget }: WidgetSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('');
  const [step, setStep] = useState(1);
  
  // State for different widget configurations
  const [statCardConfig, setStatCardConfig] = useState('agendamentos');
  const [chartConfig, setChartConfig] = useState({
    title: '',
    icon: 'TrendingUp',
    chartType: 'bar',
    variable: 'canal',
  });

  const handleReset = () => {
    setStep(1);
    setSelectedType('');
    setStatCardConfig('agendamentos');
    setChartConfig({
      title: '',
      icon: 'TrendingUp', 
      chartType: 'bar',
      variable: 'canal',
    });
  };

  const handleAddWidget = () => {
    let config: WidgetConfig;

    switch (selectedType) {
      case 'stat-card':
        config = {
          type: 'stat-card',
          statType: statCardConfig as any,
        };
        break;
      
      case 'chart':
        const iconMap: Record<string, any> = {
          TrendingUp,
          BarChart3,
          Users,
          Calendar,
          Phone,
        };
        
        config = {
          type: 'chart',
          title: chartConfig.title || 'Novo Gráfico',
          icon: iconMap[chartConfig.icon] || TrendingUp,
          chartType: chartConfig.chartType as any,
          variable: chartConfig.variable as any,
        };
        break;
      
      case 'funnel':
        config = { type: 'funnel' };
        break;
      
      case 'actions':
        config = { type: 'actions' };
        break;
      
      default:
        return;
    }

    onAddWidget(config);
    setIsOpen(false);
    handleReset();
  };

  const renderStepContent = () => {
    if (step === 1) {
      return (
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground mb-4">
            Selecione o tipo de widget que deseja adicionar:
          </div>
          
          <div className="grid gap-3">
            {widgetTypes.map((widget) => (
              <div
                key={widget.type}
                className={cn(
                  "p-4 rounded-lg border-2 cursor-pointer transition-all hover:scale-[1.02]",
                  selectedType === widget.type 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-primary/50"
                )}
                onClick={() => setSelectedType(widget.type)}
              >
                <div className="flex items-start gap-3">
                  <div className={cn("p-2 rounded-lg", widget.color)}>
                    <widget.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{widget.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {widget.description}
                    </p>
                  </div>
                  {selectedType === widget.type && (
                    <Badge className="bg-primary text-primary-foreground">
                      Selecionado
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (step === 2) {
      switch (selectedType) {
        case 'stat-card':
          return (
            <div className="space-y-4">
              <div>
                <Label>Tipo de Estatística</Label>
                <Select value={statCardConfig} onValueChange={setStatCardConfig}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statCardTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <type.icon className="h-4 w-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          );
        
        case 'chart':
          return (
            <div className="space-y-4">
              <div>
                <Label>Título do Gráfico</Label>
                <Input
                  value={chartConfig.title}
                  onChange={(e) => setChartConfig(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Ex: Análise de Vendas"
                />
              </div>
              
              <div>
                <Label>Ícone</Label>
                <Select 
                  value={chartConfig.icon} 
                  onValueChange={(value) => setChartConfig(prev => ({ ...prev, icon: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {chartIcons.map((icon) => (
                      <SelectItem key={icon.value} value={icon.value}>
                        <div className="flex items-center gap-2">
                          <icon.icon className="h-4 w-4" />
                          {icon.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Tipo de Gráfico</Label>
                <Select 
                  value={chartConfig.chartType} 
                  onValueChange={(value) => setChartConfig(prev => ({ ...prev, chartType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {chartTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <type.icon className="h-4 w-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Dados para Visualizar</Label>
                <Select 
                  value={chartConfig.variable} 
                  onValueChange={(value) => setChartConfig(prev => ({ ...prev, variable: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {dataVariables.map((variable) => (
                      <SelectItem key={variable.value} value={variable.value}>
                        {variable.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          );
        
        default:
          return (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Este widget não precisa de configuração adicional.
              </p>
            </div>
          );
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className="fixed bottom-4 right-4 md:bottom-6 md:right-6 h-12 w-12 md:h-14 md:w-14 rounded-full shadow-xl bg-primary text-primary-foreground hover:bg-primary/90 border-0 z-50 hover:scale-110 transition-all duration-200 neon-glow"
          onClick={handleReset}
        >
          <Plus className="h-5 w-5 md:h-6 md:w-6" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 1 ? 'Adicionar Widget' : 'Configurar Widget'}
          </DialogTitle>
        </DialogHeader>
        
        {renderStepContent()}
        
        <div className="flex gap-2 pt-4">
          {step === 2 && (
            <Button variant="outline" onClick={() => setStep(1)}>
              Voltar
            </Button>
          )}
          
          {step === 1 ? (
            <Button 
              onClick={() => setStep(2)}
              disabled={!selectedType}
              className="flex-1"
            >
              Próximo
            </Button>
          ) : (
            <Button 
              onClick={handleAddWidget}
              className="flex-1"
            >
              Adicionar Widget
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}