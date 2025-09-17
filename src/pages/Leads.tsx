import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Filter,
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Phone,
  Calendar,
  X,
} from "lucide-react";

// Tipos de dados
interface Lead {
  id: string;
  dataContato: string;
  nome: string;
  telefone: string;
  status: string;
  motivo: string;
  agendamento: string;
  tipoConsulta: string;
  objecao: string;
  canal: string;
  followUp: string;
}

// Status e opções disponíveis
const statusOptions = ["1º Consulta", "Paciente", "Retorno", "Procedimento", "Outros"];
const tipoConsultaOptions = ["Plano de Saúde", "Particular", "Outros"];
const objecaoOptions = ["Localidade", "Plano de Saúde", "Preço", "Horário", "Não responde", "Outra", "Nenhuma"];
const canalOptions = ["Google", "Instagram", "Youtube", "Indicação"];
const followUpOptions = ["Agendado", "Prefere Aguardar", "Não responde", "Não há interesse", "Outro"];

// Dados simulados
const leadsData: Lead[] = [
  {
    id: "1",
    dataContato: "2024-01-15",
    nome: "Maria Silva",
    telefone: "(11) 99999-9999",
    status: "1º Consulta",
    motivo: "Dor nas costas",
    agendamento: "Sim",
    tipoConsulta: "Plano de Saúde",
    objecao: "Nenhuma",
    canal: "Google",
    followUp: "Agendado",
  },
  {
    id: "2",
    dataContato: "2024-01-14",
    nome: "João Santos", 
    telefone: "(11) 88888-8888",
    status: "Paciente",
    motivo: "Consulta de rotina",
    agendamento: "Não",
    tipoConsulta: "Particular",
    objecao: "Horário",
    canal: "Instagram",
    followUp: "Prefere Aguardar",
  },
  {
    id: "3",
    dataContato: "2024-01-13",
    nome: "Ana Costa",
    telefone: "(11) 77777-7777",
    status: "Retorno",
    motivo: "Dor de cabeça",
    agendamento: "Sim",
    tipoConsulta: "Plano de Saúde",
    objecao: "Nenhuma",
    canal: "Youtube",
    followUp: "Agendado",
  },
  {
    id: "4",
    dataContato: "2024-01-12",
    nome: "Pedro Oliveira",
    telefone: "(11) 66666-6666",
    status: "1º Consulta",
    motivo: "Dor no joelho",
    agendamento: "Não",
    tipoConsulta: "Particular",
    objecao: "Preço",
    canal: "Indicação",
    followUp: "Não há interesse",
  },
  {
    id: "5",
    dataContato: "2024-01-11",
    nome: "Carla Ferreira",
    telefone: "(11) 55555-5555",
    status: "Procedimento",
    motivo: "Cirurgia menor",
    agendamento: "Sim",
    tipoConsulta: "Plano de Saúde",
    objecao: "Nenhuma",
    canal: "Google",
    followUp: "Agendado",
  },
];

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>(leadsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [editingCell, setEditingCell] = useState<{id: string, field: string} | null>(null);

  // Filtros ativos
  const activeFilters = Object.entries(filters).filter(([_, value]) => value);

  // Leads filtrados
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      // Filtro de busca
      const matchesSearch = Object.values(lead).some(value =>
        value.toLowerCase().includes(searchTerm.toLowerCase())
      );

      // Filtros específicos
      const matchesFilters = Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        return lead[key as keyof Lead] === value;
      });

      return matchesSearch && matchesFilters;
    });
  }, [leads, searchTerm, filters]);

  // Função para atualizar lead
  const updateLead = (id: string, field: keyof Lead, value: string) => {
    setLeads(prev => prev.map(lead => 
      lead.id === id ? { ...lead, [field]: value } : lead
    ));
    setEditingCell(null);
  };

  // Componente de célula editável
  const EditableCell = ({ lead, field, options }: { lead: Lead; field: keyof Lead; options?: string[] }) => {
    const isEditing = editingCell?.id === lead.id && editingCell?.field === field;
    const value = lead[field];

    if (isEditing && options) {
      return (
        <Select
          value={value}
          onValueChange={(newValue) => updateLead(lead.id, field, newValue)}
          onOpenChange={(open) => !open && setEditingCell(null)}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map(option => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    if (isEditing) {
      return (
        <Input
          defaultValue={value}
          className="h-8 text-xs"
          onBlur={(e) => updateLead(lead.id, field, e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              updateLead(lead.id, field, (e.target as HTMLInputElement).value);
            }
            if (e.key === 'Escape') {
              setEditingCell(null);
            }
          }}
          autoFocus
        />
      );
    }

    return (
      <div
        className="cursor-pointer hover:bg-muted/50 p-1 rounded text-xs"
        onClick={() => setEditingCell({ id: lead.id, field })}
      >
        {field === 'agendamento' ? (
          <Badge variant={value === 'Sim' ? 'default' : 'secondary'}>
            {value}
          </Badge>
        ) : (
          value
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Acompanhamento de Leads</h1>
          <p className="text-muted-foreground">
            Gerencie e acompanhe todos os contatos da clínica
          </p>
        </div>
        
        <Button className="bg-gradient-brand hover:bg-gradient-brand/90">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Lead
        </Button>
      </div>

      {/* Controles e Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros e Busca</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Barra de Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, telefone, motivo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filtros */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Select value={filters.status || ""} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                {statusOptions.map(option => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.canal || ""} onValueChange={(value) => setFilters(prev => ({ ...prev, canal: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Canal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                {canalOptions.map(option => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.agendamento || ""} onValueChange={(value) => setFilters(prev => ({ ...prev, agendamento: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Agendamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="Sim">Sim</SelectItem>
                <SelectItem value="Não">Não</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.tipoConsulta || ""} onValueChange={(value) => setFilters(prev => ({ ...prev, tipoConsulta: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo Consulta" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                {tipoConsultaOptions.map(option => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.objecao || ""} onValueChange={(value) => setFilters(prev => ({ ...prev, objecao: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Objeção" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas</SelectItem>
                {objecaoOptions.map(option => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.followUp || ""} onValueChange={(value) => setFilters(prev => ({ ...prev, followUp: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Follow Up" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                {followUpOptions.map(option => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filtros Ativos */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {activeFilters.map(([key, value]) => (
                <Badge key={key} variant="secondary" className="filter-badge">
                  {key}: {value}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                    onClick={() => setFilters(prev => ({ ...prev, [key]: "" }))}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilters({})}
                className="text-xs text-muted-foreground"
              >
                Limpar todos
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabela de Leads */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Leads ({filteredLeads.length})</CardTitle>
            <div className="text-sm text-muted-foreground">
              Clique em qualquer célula para editar
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data Contato</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead>Agendamento</TableHead>
                  <TableHead>Tipo Consulta</TableHead>
                  <TableHead>Objeção</TableHead>
                  <TableHead>Canal</TableHead>
                  <TableHead>Follow Up</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <EditableCell lead={lead} field="dataContato" />
                    </TableCell>
                    <TableCell>
                      <EditableCell lead={lead} field="nome" />
                    </TableCell>
                    <TableCell>
                      <EditableCell lead={lead} field="telefone" />
                    </TableCell>
                    <TableCell>
                      <EditableCell lead={lead} field="status" options={statusOptions} />
                    </TableCell>
                    <TableCell>
                      <EditableCell lead={lead} field="motivo" />
                    </TableCell>
                    <TableCell>
                      <EditableCell lead={lead} field="agendamento" options={["Sim", "Não"]} />
                    </TableCell>
                    <TableCell>
                      <EditableCell lead={lead} field="tipoConsulta" options={tipoConsultaOptions} />
                    </TableCell>
                    <TableCell>
                      <EditableCell lead={lead} field="objecao" options={objecaoOptions} />
                    </TableCell>
                    <TableCell>
                      <EditableCell lead={lead} field="canal" options={canalOptions} />
                    </TableCell>
                    <TableCell>
                      <EditableCell lead={lead} field="followUp" options={followUpOptions} />
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <Phone className="h-4 w-4 mr-2" />
                            Ligar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Calendar className="h-4 w-4 mr-2" />
                            Agendar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}