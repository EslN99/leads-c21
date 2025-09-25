import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { TrendingUp, BarChart3, PieChart as PieChartIcon, LineChart as LineChartIcon, Activity } from "lucide-react";
import { useData } from "@/contexts/DataContext";

type ChartType = 'pie' | 'bar' | 'line' | 'area';
type DataVariable = 'canal' | 'canal-contato' | 'canal-agendamento' | 'objecao' | 'status' | 'tipo-consulta' | 'follow-up';

const chartTypeOptions = [
  { value: 'pie', label: 'Pizza', icon: PieChartIcon },
  { value: 'bar', label: 'Barras', icon: BarChart3 },
  { value: 'line', label: 'Linha', icon: LineChartIcon },
  { value: 'area', label: 'Área', icon: Activity },
];

const dataVariableOptions = [
  { value: 'canal', label: 'Canal de Contato (Todos)' },
  { value: 'canal-contato', label: 'Canal de Contato' },
  { value: 'canal-agendamento', label: 'Canal de Agendamento' },
  { value: 'objecao', label: 'Objeções' },
  { value: 'status', label: 'Status do Contato' },
  { value: 'tipo-consulta', label: 'Tipo de Consulta' },
  { value: 'follow-up', label: 'Follow-up' },
];

const colors = [
  'hsl(var(--chart-1))', 
  'hsl(var(--chart-2))', 
  'hsl(var(--chart-3))', 
  'hsl(var(--chart-4))', 
  'hsl(var(--chart-5))',
  'hsl(var(--primary))',
  'hsl(var(--secondary))',
  'hsl(var(--accent))',
];

export default function InteractiveChart({ 
  title, 
  icon: Icon,
  initialChartType = 'bar',
  initialVariable = 'canal'
}: {
  title: string;
  icon: React.ComponentType<any>;
  initialChartType?: ChartType;
  initialVariable?: DataVariable;
}) {
  const { leads } = useData();
  const [chartType, setChartType] = useState<ChartType>(initialChartType);
  const [dataVariable, setDataVariable] = useState<DataVariable>(initialVariable);
  const IconComponent = typeof Icon === 'function' ? Icon : TrendingUp;

  const generateChartData = () => {
    let counts: Record<string, number> = {};
    
    switch (dataVariable) {
      case 'canal':
        counts = leads.reduce((acc, lead) => {
          acc[lead.canal] = (acc[lead.canal] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        break;
      case 'canal-contato':
        counts = leads.reduce((acc, lead) => {
          acc[lead.canal] = (acc[lead.canal] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        break;
      case 'canal-agendamento':
        counts = leads.reduce((acc, lead) => {
          if (lead.agendamento === 'Sim') {
            acc[lead.canal] = (acc[lead.canal] || 0) + 1;
          }
          return acc;
        }, {} as Record<string, number>);
        break;
      case 'objecao':
        counts = leads.reduce((acc, lead) => {
          if (lead.objecao !== 'Nenhuma') {
            acc[lead.objecao] = (acc[lead.objecao] || 0) + 1;
          }
          return acc;
        }, {} as Record<string, number>);
        break;
      case 'status':
        counts = leads.reduce((acc, lead) => {
          acc[lead.statusContato] = (acc[lead.statusContato] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        break;
      case 'tipo-consulta':
        counts = leads.reduce((acc, lead) => {
          acc[lead.tipoConsulta] = (acc[lead.tipoConsulta] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        break;
      case 'follow-up':
        counts = leads.reduce((acc, lead) => {
          acc[lead.followUp] = (acc[lead.followUp] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        break;
    }

    return Object.entries(counts).map(([name, value], index) => ({
      name,
      value,
      quantidade: value,
      color: colors[index % colors.length],
      fill: colors[index % colors.length],
    }));
  };

  const data = generateChartData();

  const renderChart = () => {
    switch (chartType) {
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        );
      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="hsl(var(--primary))" />
          </BarChart>
        );
      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} />
          </LineChart>
        );
      case 'area':
        return (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
          </AreaChart>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <IconComponent className="h-5 w-5 text-primary" />
            {title}
          </CardTitle>
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={dataVariable} onValueChange={(value: DataVariable) => setDataVariable(value)}>
              <SelectTrigger className="w-full sm:w-[160px] md:w-[140px] lg:w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {dataVariableOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={chartType} onValueChange={(value: ChartType) => setChartType(value)}>
              <SelectTrigger className="w-full sm:w-[120px] md:w-[100px] lg:w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {chartTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <option.icon className="h-4 w-4" />
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          {renderChart()}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}