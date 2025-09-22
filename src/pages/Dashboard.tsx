import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  FunnelChart,
  Funnel,
  LabelList,
} from "recharts";
import {
  Calendar,
  Users,
  TrendingUp,
  Phone,
  MapPin,
  Clock,
  Filter,
  Plus,
  ArrowUp,
  ArrowDown,
  BarChart3,
} from "lucide-react";
import { useData } from "@/contexts/DataContext";
import InteractiveChart from "@/components/InteractiveChart";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const { getStats, getChartData, addLead } = useData();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [periodo, setPeriodo] = useState("mes");
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [newLead, setNewLead] = useState({
    nome: '',
    telefone: '',
    motivo: '',
    canal: 'Google' as const,
  });

  const stats = getStats();
  const chartData = getChartData();

  const statCards = [
    {
      title: "Total de Agendamentos",
      value: stats.totalAgendamentos.toString(),
      change: `${stats.comparacao.totalAgendamentos > 0 ? '+' : ''}${stats.comparacao.totalAgendamentos}%`,
      trend: stats.comparacao.totalAgendamentos >= 0 ? "up" : "down",
      icon: Calendar,
      color: "bg-secondary",
    },
    {
      title: "Novos Leads",
      value: stats.novosLeads.toString(),
      change: `${stats.comparacao.novosLeads > 0 ? '+' : ''}${stats.comparacao.novosLeads}%`,
      trend: stats.comparacao.novosLeads >= 0 ? "up" : "down", 
      icon: Users,
      color: "bg-primary",
    },
    {
      title: "Taxa de Conversão",
      value: `${stats.taxaConversao}%`,
      change: `${stats.comparacao.taxaConversao > 0 ? '+' : ''}${stats.comparacao.taxaConversao}%`,
      trend: stats.comparacao.taxaConversao >= 0 ? "up" : "down",
      icon: TrendingUp,
      color: "bg-success",
    },
    {
      title: "Leads Ativos",
      value: stats.leadsAtivos.toString(),
      change: `${stats.comparacao.leadsAtivos > 0 ? '+' : ''}${stats.comparacao.leadsAtivos}%`,
      trend: stats.comparacao.leadsAtivos >= 0 ? "up" : "down",
      icon: Phone,
      color: "bg-warning",
    },
  ];

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

  const handleScheduleAppointment = () => {
    navigate('/leads');
    toast.info("Redirecionando para a página de leads para agendar consulta");
  };

  const handleFollowUp = () => {
    navigate('/crm');
    toast.info("Redirecionando para o CRM para acompanhar follow-ups");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <div>
          <h1 className={cn("font-bold tracking-tight", isMobile ? "text-2xl" : "text-3xl")}>
            Dashboard
          </h1>
          <p className="text-muted-foreground text-sm lg:text-base">
            Visão geral do desempenho da clínica
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title} className="stats-card">
            <CardContent className={cn("p-4 lg:p-6", isMobile && "space-y-2")}>
              <div className={cn("flex items-center", isMobile ? "flex-col text-center" : "justify-between")}>
                <div className={cn(isMobile && "order-2")}>
                  <p className={cn("font-medium text-muted-foreground/80", isMobile ? "text-xs" : "text-sm")}>
                    {stat.title}
                  </p>
                  <div className="flex items-baseline gap-2 justify-center">
                    <p className={cn("font-bold gradient-text", isMobile ? "text-xl" : "text-2xl")}>{stat.value}</p>
                    <Badge
                      variant={stat.trend === "up" ? "default" : "destructive"}
                      className={cn("text-xs flex items-center gap-1 bg-primary/10 text-primary border-primary/20", 
                        stat.trend === "up" ? "neon-glow" : "")}
                    >
                      {stat.trend === "up" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                      {stat.change}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    vs. período anterior
                  </p>
                </div>
                <div className={cn("p-4 rounded-2xl bg-primary/10 border border-primary/20", isMobile && "order-1 mb-2")}>
                  <stat.icon className={cn("text-primary", isMobile ? "h-6 w-6" : "h-8 w-8")} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Interactive Charts Grid */}
      <div className={cn("grid gap-4 lg:gap-6", isMobile ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2")}>
        <InteractiveChart 
          title="Canal de Contato" 
          icon={TrendingUp}
          initialChartType="pie"
          initialVariable="canal-contato"
        />
        <InteractiveChart 
          title="Canal de Agendamento" 
          icon={Calendar}
          initialChartType="pie"
          initialVariable="canal-agendamento"
        />
      </div>

      <div className={cn("grid gap-4 lg:gap-6", isMobile ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2")}>
        <InteractiveChart 
          title="Principais Objeções" 
          icon={MapPin}
          initialChartType="bar"
          initialVariable="objecao"
        />
      </div>

      {/* Funil de Vendas Kanban */}
      <Card className="futuristic-funnel">
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
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300"></div>
                  
                  {/* Content */}
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
                  
                  {/* Border glow */}
                  <div className="absolute inset-0 rounded-2xl border border-white/20 group-hover:border-white/40 transition-colors duration-300"></div>
                  
                  {/* Tooltip on hover - repositioned */}
                  <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-background/95 backdrop-blur-sm border border-primary/20 rounded-lg px-4 py-2 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50 min-w-max">
                    <div className="text-foreground text-center">{stage.name}</div>
                    <div className="text-primary font-bold text-center">{stage.value} leads</div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-border"></div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Legend */}
          <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {chartData.funil.map((stage, index) => {
              const colors = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];
              return (
                <div key={`legend-${stage.name}`} className="flex items-center gap-2 p-3 rounded-xl bg-muted/30 border border-border/30">
                  <div 
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: colors[index % colors.length] }}
                  ></div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-foreground truncate">{stage.name}</div>
                    <div className="text-xs text-muted-foreground">{stage.value} leads</div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Ações Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base lg:text-lg">
            <Clock className="h-5 w-5 text-primary" />
            Ações Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={cn("grid gap-4", isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-3")}>
            <Dialog open={isAddLeadOpen} onOpenChange={setIsAddLeadOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className={cn("flex-col gap-2", isMobile ? "h-14" : "h-16")}>
                  <Users className={cn(isMobile ? "h-5 w-5" : "h-6 w-6")} />
                  Adicionar Lead
                </Button>
              </DialogTrigger>
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
            <Button variant="outline" className={cn("flex-col gap-2", isMobile ? "h-14" : "h-16")} onClick={handleScheduleAppointment}>
              <Calendar className={cn(isMobile ? "h-5 w-5" : "h-6 w-6")} />
              Novo Agendamento
            </Button>
            <Button variant="outline" className={cn("flex-col gap-2", isMobile ? "h-14" : "h-16")} onClick={handleFollowUp}>
              <Phone className={cn(isMobile ? "h-5 w-5" : "h-6 w-6")} />
              Follow-up Pendente
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico Interativo Adicional */}
      <div className={cn("grid gap-4 lg:gap-6", isMobile ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2")}>
        <InteractiveChart 
          title="Status dos Contatos" 
          icon={BarChart3}
          initialChartType="area"
          initialVariable="status"
        />
        <InteractiveChart 
          title="Tipos de Consulta" 
          icon={Users}
          initialChartType="pie"
          initialVariable="tipo-consulta"
        />
      </div>
    </div>
  );
}