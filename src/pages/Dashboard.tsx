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
} from "lucide-react";

// Dados simulados
const agendamentosData = [
  { name: "Google", value: 45, color: "#04BF8A" },
  { name: "Instagram", value: 30, color: "#0A0A20" },
  { name: "YouTube", value: 15, color: "#5EE0A9" },
  { name: "Indicação", value: 10, color: "#CCCCCC" },
];

const objecoesData = [
  { name: "Preço", quantidade: 25 },
  { name: "Horário", quantidade: 20 },
  { name: "Localidade", quantidade: 15 },
  { name: "Plano de Saúde", quantidade: 12 },
  { name: "Não responde", quantidade: 8 },
];

const funnelData = [
  { name: "Contatos Iniciais", value: 100, fill: "#04BF8A" },
  { name: "Qualificação Lead", value: 75, fill: "#0A0A20" },
  { name: "Qualificação Consulta", value: 50, fill: "#5EE0A9" },
  { name: "Agendamentos", value: 35, fill: "#0A0A2F" },
];

export default function Dashboard() {
  const [periodo, setPeriodo] = useState("mes");

  const stats = [
    {
      title: "Total de Agendamentos",
      value: "127",
      change: "+12%",
      trend: "up",
      icon: Calendar,
      color: "bg-secondary",
    },
    {
      title: "Novos Leads",
      value: "89",
      change: "+8%",
      trend: "up", 
      icon: Users,
      color: "bg-primary",
    },
    {
      title: "Taxa de Conversão",
      value: "35%",
      change: "+5%",
      trend: "up",
      icon: TrendingUp,
      color: "bg-success",
    },
    {
      title: "Leads Ativos",
      value: "56",
      change: "-3%",
      trend: "down",
      icon: Phone,
      color: "bg-warning",
    },
  ];

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
        {stats.map((stat) => (
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
                      className="text-xs"
                    >
                      {stat.change}
                    </Badge>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Agendamentos por Canal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Agendamentos por Canal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={agendamentosData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {agendamentosData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Principais Objeções */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Principais Objeções
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={objecoesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="quantidade" fill="#04BF8A" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

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
                data={funnelData}
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
            <Button variant="outline" className="h-16 flex-col gap-2">
              <Users className="h-6 w-6" />
              Adicionar Lead
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2">
              <Calendar className="h-6 w-6" />
              Novo Agendamento
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2">
              <Phone className="h-6 w-6" />
              Follow-up Pendente
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}