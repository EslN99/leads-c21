import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, GripVertical, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import InteractiveChart from "./InteractiveChart";
import { useData } from "@/contexts/DataContext";
import {
  Calendar,
  Users,
  TrendingUp,
  Phone,
  ArrowUp,
  ArrowDown,
  Filter,
} from "lucide-react";

export type WidgetType = 'stat-card' | 'chart' | 'funnel' | 'actions';

export type StatCardConfig = {
  type: 'stat-card';
  statType: 'agendamentos' | 'leads' | 'conversao' | 'ativos';
};

export type ChartConfig = {
  type: 'chart';
  title: string;
  icon: any;
  chartType: 'pie' | 'bar' | 'line' | 'area';
  variable: 'canal' | 'canal-contato' | 'canal-agendamento' | 'objecao' | 'status' | 'tipo-consulta' | 'follow-up';
};

export type FunnelConfig = {
  type: 'funnel';
};

export type ActionsConfig = {
  type: 'actions';
};

export type WidgetConfig = StatCardConfig | ChartConfig | FunnelConfig | ActionsConfig;

export interface DashboardWidgetProps {
  id: string;
  config: WidgetConfig;
  onRemove: (id: string) => void;
  isDragging?: boolean;
}

export default function DashboardWidget({ id, config, onRemove, isDragging }: DashboardWidgetProps) {
  const { getStats, getChartData } = useData();
  const [isEditing, setIsEditing] = useState(false);

  const renderStatCard = (statType: StatCardConfig['statType']) => {
    const stats = getStats();
    
    const statConfigs = {
      agendamentos: {
        title: "Total de Agendamentos",
        shortTitle: "Agendamentos",
        value: stats.totalAgendamentos.toString(),
        change: `${stats.comparacao.totalAgendamentos > 0 ? '+' : ''}${stats.comparacao.totalAgendamentos}%`,
        trend: stats.comparacao.totalAgendamentos >= 0 ? "up" : "down" as const,
        icon: Calendar,
        color: "bg-secondary",
      },
      leads: {
        title: "Novos Leads",
        shortTitle: "Leads",
        value: stats.novosLeads.toString(),
        change: `${stats.comparacao.novosLeads > 0 ? '+' : ''}${stats.comparacao.novosLeads}%`,
        trend: stats.comparacao.novosLeads >= 0 ? "up" : "down" as const,
        icon: Users,
        color: "bg-primary",
      },
      conversao: {
        title: "Taxa de Conversão",
        shortTitle: "Conversão",
        value: `${stats.taxaConversao}%`,
        change: `${stats.comparacao.taxaConversao > 0 ? '+' : ''}${stats.comparacao.taxaConversao}%`,
        trend: stats.comparacao.taxaConversao >= 0 ? "up" : "down" as const,
        icon: TrendingUp,
        color: "bg-success",
      },
      ativos: {
        title: "Leads Ativos", 
        shortTitle: "Ativos",
        value: stats.leadsAtivos.toString(),
        change: `${stats.comparacao.leadsAtivos > 0 ? '+' : ''}${stats.comparacao.leadsAtivos}%`,
        trend: stats.comparacao.leadsAtivos >= 0 ? "up" : "down" as const,
        icon: Phone,
        color: "bg-warning",
      },
    };

    const stat = statConfigs[statType];

    return (
      <CardContent className="p-3 sm:p-4 lg:p-6">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <p className="font-medium text-muted-foreground/80 text-xs sm:text-sm truncate">
              <span className="hidden sm:inline">{stat.title}</span>
              <span className="sm:hidden">{stat.shortTitle}</span>
            </p>
            <div className="flex items-baseline gap-1.5 sm:gap-2 mt-1">
              <p className="font-bold gradient-text text-lg sm:text-xl lg:text-2xl">
                {stat.value}
              </p>
              <Badge
                variant={stat.trend === "up" ? "default" : "destructive"}
                className="text-xs flex items-center gap-1 bg-primary/10 text-primary border-primary/20 px-1.5 py-0.5"
              >
                {stat.trend === "up" ? <ArrowUp className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> : <ArrowDown className="h-2.5 w-2.5 sm:h-3 sm:w-3" />}
                <span className="hidden sm:inline">{stat.change}</span>
                <span className="sm:hidden">{stat.trend === "up" ? "+" : "-"}</span>
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground/60 mt-0.5 sm:mt-1 hidden sm:block">
              vs. período anterior
            </p>
          </div>
          <div className="p-2.5 sm:p-3 lg:p-4 rounded-xl lg:rounded-2xl bg-primary/10 border border-primary/20 flex-shrink-0 ml-2">
            <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-primary" />
          </div>
        </div>
      </CardContent>
    );
  };

  const renderFunnel = () => {
    const chartData = getChartData();
    
    return (
      <CardContent className="relative z-10 pt-16 pb-8">
        <div className="space-y-3 relative">
          {chartData.funil.map((stage, index) => {
            const percentage = chartData.funil.length > 0 ? (stage.value / Math.max(...chartData.funil.map(s => s.value))) * 100 : 0;
            const colors = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];
            
            return (
              <div 
                key={stage.name}
                className="group relative overflow-visible rounded-2xl transition-all duration-500 hover:scale-105 cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, ${colors[index % colors.length]} 0%, ${colors[index % colors.length]}80 100%)`,
                  height: `${Math.max(70, percentage * 0.9 + 20)}px`,
                  width: `${Math.max(40, percentage)}%`,
                  marginLeft: `${(100 - Math.max(40, percentage)) / 2}%`,
                  boxShadow: `0 4px 20px ${colors[index % colors.length]}40`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300"></div>
                
                <div className="relative z-10 flex items-center justify-center h-full px-4">
                  <div className="text-center">
                    <div className="font-bold text-white text-lg drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {stage.value}
                    </div>
                    <div className="text-white/90 text-sm font-medium drop-shadow-md">
                      {stage.name}
                    </div>
                  </div>
                </div>
                
                <div className="absolute inset-0 rounded-2xl border border-white/20 group-hover:border-white/40 transition-colors duration-300"></div>
                
                <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-background/95 backdrop-blur-sm border border-primary/20 rounded-lg px-4 py-2 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50 min-w-max">
                  <div className="text-foreground text-center">{stage.name}</div>
                  <div className="text-primary font-bold text-center">{stage.value} leads</div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-border"></div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    );
  };

  const renderActions = () => {
    return (
      <CardContent>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <Button variant="outline" className="flex-col gap-2 h-16">
            <Users className="h-6 w-6" />
            Adicionar Lead
          </Button>
          <Button variant="outline" className="flex-col gap-2 h-16">
            <Calendar className="h-6 w-6" />
            Novo Agendamento
          </Button>
          <Button variant="outline" className="flex-col gap-2 h-16">
            <Phone className="h-6 w-6" />
            Follow-up Pendente
          </Button>
        </div>
      </CardContent>
    );
  };

  const renderContent = () => {
    switch (config.type) {
      case 'stat-card':
        return renderStatCard(config.statType);
      
      case 'chart':
        return (
          <InteractiveChart
            title={config.title}
            icon={config.icon}
            initialChartType={config.chartType}
            initialVariable={config.variable}
          />
        );
      
      case 'funnel':
        return (
          <>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-base lg:text-xl font-bold">
                <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 neon-glow">
                  <Filter className="h-6 w-6 text-primary" />
                </div>
                <span className="gradient-text">Pipeline de Conversão</span>
              </CardTitle>
              <p className="text-muted-foreground/70 text-sm">
                Fluxo de leads através das etapas do kanban
              </p>
            </CardHeader>
            {renderFunnel()}
          </>
        );
      
      case 'actions':
        return (
          <>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base lg:text-lg">
                <Calendar className="h-5 w-5 text-primary" />
                Ações Rápidas
              </CardTitle>
            </CardHeader>
            {renderActions()}
          </>
        );
      
      default:
        return null;
    }
  };

  if (config.type === 'chart') {
    return (
      <div className={cn("relative group", isDragging && "opacity-50")}>
        <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 bg-background/80 hover:bg-destructive hover:text-destructive-foreground"
            onClick={() => onRemove(id)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
        <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
          <div className="p-1 bg-background/80 rounded">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        {renderContent()}
      </div>
    );
  }

  return (
    <Card className={cn(
      "relative group transition-all duration-200", 
      isDragging && "opacity-50 scale-95",
      config.type === 'funnel' && "futuristic-funnel"
    )}>
      <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 bg-background/80 hover:bg-destructive hover:text-destructive-foreground"
          onClick={() => onRemove(id)}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
      
      <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
        <div className="p-1 bg-background/80 rounded">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
      
      {renderContent()}
    </Card>
  );
}