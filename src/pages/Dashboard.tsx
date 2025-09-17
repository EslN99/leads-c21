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

export default function Dashboard() {
  const { getStats, getChartData, addLead } = useData();
  const navigate = useNavigate();
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral do desempenho da clínica
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Select value={periodo} onValueChange={setPeriodo}>
            <SelectTrigger className="w-[180px]">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title} className="stats-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <Badge
                      variant={stat.trend === "up" ? "default" : "destructive"}
                      className="text-xs flex items-center gap-1"
                    >
                      {stat.trend === "up" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                      {stat.change}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    vs. período anterior
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Interactive Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InteractiveChart 
          title="Análise por Canal" 
          icon={TrendingUp}
          initialChartType="pie"
          initialVariable="canal"
        />
        <InteractiveChart 
          title="Principais Objeções" 
          icon={MapPin}
          initialChartType="bar"
          initialVariable="objecao"
        />
      </div>

      {/* Funil de Vendas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            Funil de Conversão
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <FunnelChart>
              <Tooltip />
              <Funnel
                dataKey="value"
                data={chartData.funil}
                isAnimationActive
              >
                <LabelList position="center" fill="#fff" stroke="none" />
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Ações Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Ações Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Dialog open={isAddLeadOpen} onOpenChange={setIsAddLeadOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="h-16 flex-col gap-2">
                  <Users className="h-6 w-6" />
                  Adicionar Lead
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Lead</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
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
                  <div className="flex gap-2">
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
            <Button variant="outline" className="h-16 flex-col gap-2" onClick={handleScheduleAppointment}>
              <Calendar className="h-6 w-6" />
              Novo Agendamento
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2" onClick={handleFollowUp}>
              <Phone className="h-6 w-6" />
              Follow-up Pendente
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico Interativo Adicional */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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