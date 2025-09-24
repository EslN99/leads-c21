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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useData, Lead } from "@/contexts/DataContext";
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
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

// Status e opções disponíveis
const statusOptions = ["1º Consulta", "Paciente", "Retorno", "Procedimento", "Outros"];
const tipoConsultaOptions = ["Plano de Saúde", "Particular", "Outros"];
const objecaoOptions = ["Localidade", "Plano de Saúde", "Preço", "Horário", "Não responde", "Outra", "Nenhuma"];
const canalOptions = ["Google", "Instagram", "YouTube", "Indicação"];
const followUpOptions = ["Agendado", "Prefere Aguardar", "Não responde", "Não há interesse", "Outro"];
const prioridadeOptions = ["alta", "media", "baixa"];
const kanbanStatusOptions = ["inicio", "qualificacao-lead", "qualificacao-consulta", "agendado"];

export default function Leads() {
  const { leads, addLead, updateLead, deleteLead } = useData();
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [editingCell, setEditingCell] = useState<{id: string, field: string} | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newLead, setNewLead] = useState<Partial<Lead>>({
    nome: "",
    telefone: "",
    dataContato: new Date().toISOString().split('T')[0],
    statusContato: "1º Consulta",
    motivo: "",
    agendamento: "Não",
    tipoConsulta: "Particular",
    objecao: "Nenhuma",
    canal: "Google",
    followUp: "Prefere Aguardar",
    kanbanStatus: "inicio",
    prioridade: "media",
    observacoes: ""
  });

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
  const handleUpdateLead = (id: string, field: keyof Lead, value: string) => {
    updateLead(id, { [field]: value });
    setEditingCell(null);
  };

  // Função para adicionar lead
  const handleAddLead = () => {
    if (!newLead.nome || !newLead.telefone) {
      toast({
        title: "Erro",
        description: "Nome e telefone são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    addLead(newLead as Omit<Lead, 'id'>);
    setIsAddDialogOpen(false);
    setNewLead({
      nome: "",
      telefone: "",
      dataContato: new Date().toISOString().split('T')[0],
      statusContato: "1º Consulta",
      motivo: "",
      agendamento: "Não",
      tipoConsulta: "Particular",
      objecao: "Nenhuma",
      canal: "Google",
      followUp: "Prefere Aguardar",
      kanbanStatus: "inicio",
      prioridade: "media",
      observacoes: ""
    });
    toast({
      title: "Sucesso",
      description: "Lead adicionado com sucesso!"
    });
  };

  // Componente de célula editável
  const EditableCell = ({ lead, field, options }: { lead: Lead; field: keyof Lead; options?: string[] }) => {
    const isEditing = editingCell?.id === lead.id && editingCell?.field === field;
    const value = lead[field];

    if (isEditing && options) {
      return (
        <Select
          value={value}
          onValueChange={(newValue) => handleUpdateLead(lead.id, field, newValue)}
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
          onBlur={(e) => handleUpdateLead(lead.id, field, e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleUpdateLead(lead.id, field, (e.target as HTMLInputElement).value);
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
    <div className={cn("space-y-4", isMobile ? "space-y-3" : "space-y-6")}>
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
            Acompanhamento de Leads
          </h1>
          <p className={cn(
            "text-muted-foreground mt-1", 
            isMobile ? "text-xs" : "text-sm lg:text-base"
          )}>
            {isMobile 
              ? "Gerencie todos os contatos" 
              : "Gerencie e acompanhe todos os contatos da clínica"
            }
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className={cn(
              "bg-gradient-primary hover:bg-gradient-primary/90 neon-glow",
              isMobile ? "w-full" : "w-auto"
            )}>
              <Plus className="h-4 w-4 mr-2" />
              {isMobile ? "Adicionar" : "Adicionar Lead"}
            </Button>
          </DialogTrigger>
          <DialogContent className={cn(
            "max-w-full", 
            isMobile 
              ? "w-[95vw] h-[90vh] max-w-none p-4" 
              : "max-w-4xl max-h-[85vh]"
          )}>
            <DialogHeader>
              <DialogTitle className={cn(isMobile ? "text-base" : "text-lg")}>
                Adicionar Novo Lead
              </DialogTitle>
            </DialogHeader>
            <div className={cn(
              "grid gap-3 py-4", 
              isMobile 
                ? "grid-cols-1 max-h-[70vh] overflow-y-auto space-y-1" 
                : "grid-cols-2 lg:grid-cols-3 gap-4"
            )}>
              <div className="space-y-2">
                <Label htmlFor="nome">Nome *</Label>
                <Input
                  id="nome"
                  value={newLead.nome || ""}
                  onChange={(e) => setNewLead(prev => ({ ...prev, nome: e.target.value }))}
                  placeholder="Nome completo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone *</Label>
                <Input
                  id="telefone"
                  value={newLead.telefone || ""}
                  onChange={(e) => setNewLead(prev => ({ ...prev, telefone: e.target.value }))}
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dataContato">Data do Contato</Label>
                <Input
                  id="dataContato"
                  type="date"
                  value={newLead.dataContato || ""}
                  onChange={(e) => setNewLead(prev => ({ ...prev, dataContato: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="statusContato">Status</Label>
                <Select value={newLead.statusContato} onValueChange={(value) => setNewLead(prev => ({ ...prev, statusContato: value as Lead['statusContato'] }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="motivo">Motivo</Label>
                <Input
                  id="motivo"
                  value={newLead.motivo || ""}
                  onChange={(e) => setNewLead(prev => ({ ...prev, motivo: e.target.value }))}
                  placeholder="Motivo do contato"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="canal">Canal</Label>
                <Select value={newLead.canal} onValueChange={(value) => setNewLead(prev => ({ ...prev, canal: value as Lead['canal'] }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {canalOptions.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipoConsulta">Tipo de Consulta</Label>
                <Select value={newLead.tipoConsulta} onValueChange={(value) => setNewLead(prev => ({ ...prev, tipoConsulta: value as Lead['tipoConsulta'] }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tipoConsultaOptions.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="prioridade">Prioridade</Label>
                <Select value={newLead.prioridade} onValueChange={(value) => setNewLead(prev => ({ ...prev, prioridade: value as Lead['prioridade'] }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {prioridadeOptions.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className={cn("flex gap-2", isMobile ? "flex-col" : "justify-end")}>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddLead}>
                Adicionar Lead
              </Button>
            </div>
          </DialogContent>
        </Dialog>
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
          <div className={cn("grid gap-4", isMobile ? "grid-cols-1" : "grid-cols-2 md:grid-cols-4 lg:grid-cols-6")}>
            <Select 
              value={filters.status || undefined} 
              onValueChange={(value) => setFilters(prev => ({ ...prev, status: value === "all" ? "" : value }))}
            >
              <SelectTrigger className={cn(isMobile ? "h-9 text-xs" : "h-10")}>
                <SelectValue placeholder={isMobile ? "Status" : "Todos os Status"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {statusOptions.map(option => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select 
              value={filters.canal || undefined} 
              onValueChange={(value) => setFilters(prev => ({ ...prev, canal: value === "all" ? "" : value }))}
            >
              <SelectTrigger className={cn(isMobile ? "h-9 text-xs" : "h-10")}>
                <SelectValue placeholder={isMobile ? "Canal" : "Todos os Canais"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {canalOptions.map(option => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select 
              value={filters.agendamento || undefined} 
              onValueChange={(value) => setFilters(prev => ({ ...prev, agendamento: value === "all" ? "" : value }))}
            >
              <SelectTrigger className={cn(isMobile ? "h-9 text-xs" : "h-10")}>
                <SelectValue placeholder={isMobile ? "Agenda" : "Agendamento"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="Sim">Sim</SelectItem>
                <SelectItem value="Não">Não</SelectItem>
              </SelectContent>
            </Select>

            {!isMobile && (
              <>
                <Select 
                  value={filters.tipoConsulta || undefined} 
                  onValueChange={(value) => setFilters(prev => ({ ...prev, tipoConsulta: value === "all" ? "" : value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de Consulta" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {tipoConsultaOptions.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select 
                  value={filters.objecao || undefined} 
                  onValueChange={(value) => setFilters(prev => ({ ...prev, objecao: value === "all" ? "" : value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Objeções" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {objecaoOptions.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select 
                  value={filters.followUp || undefined} 
                  onValueChange={(value) => setFilters(prev => ({ ...prev, followUp: value === "all" ? "" : value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Follow Up" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {followUpOptions.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}
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
      <Card className="futuristic-card">
        <CardHeader className={cn("pb-3", isMobile && "pb-2")}>
          <div className={cn(
            "flex items-center justify-between",
            isMobile && "flex-col items-start gap-2"
          )}>
            <CardTitle className={cn(isMobile ? "text-base" : "text-lg")}>
              Leads ({filteredLeads.length})
            </CardTitle>
            {!isMobile && (
              <div className="text-sm text-muted-foreground">
                Clique em qualquer célula para editar
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className={cn(isMobile ? "p-0" : "")}>
          {isMobile ? (
            /* Mobile Card View */
            <div className="space-y-3 p-3">
              {filteredLeads.map((lead) => (
                <Card key={lead.id} className="p-4 bg-muted/20 border-border/50">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-sm">{lead.nome}</h3>
                        <p className="text-xs text-muted-foreground">{lead.telefone}</p>
                      </div>
                      <Badge variant={lead.agendamento === 'Sim' ? 'default' : 'secondary'} className="text-xs">
                        {lead.agendamento === 'Sim' ? 'Agendado' : 'Pendente'}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Status:</span>
                        <p className="font-medium">{lead.statusContato}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Canal:</span>
                        <p className="font-medium">{lead.canal}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Data:</span>
                        <p className="font-medium">{new Date(lead.dataContato).toLocaleDateString('pt-BR')}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Follow-up:</span>
                        <p className="font-medium">{lead.followUp}</p>
                      </div>
                    </div>
                    
                    {lead.motivo && (
                      <div className="text-xs">
                        <span className="text-muted-foreground">Motivo:</span>
                        <p className="text-foreground mt-1">{lead.motivo}</p>
                      </div>
                    )}
                    
                    <div className="flex gap-2 pt-2 border-t border-border/50">
                      <Button size="sm" variant="outline" className="flex-1 h-8 text-xs">
                        <Phone className="h-3 w-3 mr-1" />
                        Ligar
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 h-8 text-xs">
                        <Calendar className="h-3 w-3 mr-1" />
                        Agendar
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => {
                              deleteLead(lead.id);
                              toast({ title: "Lead excluído com sucesso" });
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            /* Desktop Table View */
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
                        <EditableCell lead={lead} field="statusContato" options={statusOptions} />
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
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => {
                                deleteLead(lead.id);
                                toast({ title: "Lead excluído com sucesso" });
                              }}
                            >
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}