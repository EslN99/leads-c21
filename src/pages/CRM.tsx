import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Phone,
  Calendar,
  Clock,
  MapPin,
  MessageCircle,
  User,
  Plus,
  Filter,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useData, Lead } from "@/contexts/DataContext";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

// Configuração das colunas do Kanban
const colunas = [
  {
    id: 'inicio',
    titulo: 'Início do Contato',
    cor: 'bg-muted',
    limite: undefined,
  },
  {
    id: 'qualificacao-lead',
    titulo: 'Qualificação do Lead',
    cor: 'bg-primary/10',
    limite: undefined,
  },
  {
    id: 'qualificacao-consulta',
    titulo: 'Qualificação da Consulta',
    cor: 'bg-secondary/10',
    limite: undefined,
  },
  {
    id: 'agendado',
    titulo: 'Agendamento Feito',
    cor: 'bg-success/10',
    limite: undefined,
  },
];

// Componente do Card de Lead
function LeadCard({ lead, onCardClick, onMoveCard }: {
  lead: Lead;
  onCardClick: (lead: Lead) => void;
  onMoveCard: (leadId: string, novoStatus: Lead['kanbanStatus']) => void;
}) {
  const getPrioridadeColor = (prioridade: Lead['prioridade']) => {
    switch (prioridade) {
      case 'alta': return 'border-l-destructive bg-destructive/5';
      case 'media': return 'border-l-warning bg-warning/5';
      case 'baixa': return 'border-l-success bg-success/5';
      default: return 'border-l-muted';
    }
  };

  const getInitials = (nome: string) => {
    return nome.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div
      className={`kanban-card border-l-4 ${getPrioridadeColor(lead.prioridade)} group`}
      onClick={() => onCardClick(lead)}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', lead.id);
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs bg-primary text-primary-foreground">
              {getInitials(lead.nome)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-medium text-sm">{lead.nome}</h4>
            <p className="text-xs text-muted-foreground">{lead.telefone}</p>
          </div>
        </div>
        <Badge variant={lead.prioridade === 'alta' ? 'destructive' : 'secondary'} className="text-xs">
          {lead.prioridade}
        </Badge>
      </div>
      
      <div className="space-y-2">
        <p className="text-sm text-card-foreground">{lead.motivo}</p>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {lead.canal}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {new Date(lead.dataContato).toLocaleDateString()}
          </div>
        </div>
        
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-6 w-6 p-0"
            onClick={(e) => {
              e.stopPropagation();
              toast.info(`Ligando para ${lead.nome}`);
            }}
          >
            <Phone className="h-3 w-3" />
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-6 w-6 p-0"
            onClick={(e) => {
              e.stopPropagation();
              toast.info(`Abrindo WhatsApp de ${lead.nome}`);
            }}
          >
            <MessageCircle className="h-3 w-3" />
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-6 w-6 p-0"
            onClick={(e) => {
              e.stopPropagation();
              toast.info(`Agendando consulta para ${lead.nome}`);
            }}
          >
            <Calendar className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function CRM() {
  const { leads, updateLead } = useData();
  const isMobile = useIsMobile();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrar leads por busca
  const filteredLeads = leads.filter(lead =>
    lead.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.motivo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.canal.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Agrupar leads por status kanban
  const leadsPorColuna = colunas.reduce((acc, coluna) => {
    acc[coluna.id] = filteredLeads.filter(lead => lead.kanbanStatus === coluna.id);
    return acc;
  }, {} as Record<string, Lead[]>);

  // Mover card entre colunas
  const moveCard = (leadId: string, novoStatus: Lead['kanbanStatus']) => {
    updateLead(leadId, { kanbanStatus: novoStatus });
    toast.success("Lead movido com sucesso!");
  };

  // Handlers de drag and drop
  const handleDrop = (e: React.DragEvent, status: Lead['kanbanStatus']) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('text/plain');
    moveCard(leadId, status);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <div>
          <h1 className={cn("font-bold tracking-tight", isMobile ? "text-2xl" : "text-3xl")}>
            CRM Kanban
          </h1>
          <p className="text-muted-foreground text-sm lg:text-base">
            Gerencie o fluxo de qualificação dos leads
          </p>
        </div>
        
        <Button className="bg-gradient-brand hover:bg-gradient-brand/90">
          <Plus className="h-4 w-4 mr-2" />
          Novo Lead
        </Button>
      </div>

      {/* Controles */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Kanban Board */}
      <div className={cn("grid gap-4 lg:gap-6", isMobile ? "grid-cols-1 space-y-4" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4")}>
        {colunas.map((coluna) => (
          <div key={coluna.id} className={cn(isMobile && "w-full")}>
            <Card className={`${coluna.cor} border-2`}>
              <CardHeader className={cn("pb-3", isMobile && "py-2")}>
                <CardTitle className={cn("font-medium flex items-center justify-between", isMobile ? "text-sm" : "text-sm")}>
                  {coluna.titulo}
                  <Badge variant="secondary" className="ml-2">
                    {leadsPorColuna[coluna.id]?.length || 0}
                  </Badge>
                </CardTitle>
              </CardHeader>
            </Card>
            
            {/* Drop Zone */}
            <div
              className={cn("space-y-3 p-2 rounded-lg border-2 border-dashed border-transparent hover:border-border/50 transition-colors",
                isMobile ? "min-h-[200px]" : "min-h-[500px]"
              )}
              onDrop={(e) => handleDrop(e, coluna.id as Lead['kanbanStatus'])}
              onDragOver={handleDragOver}
            >
              {leadsPorColuna[coluna.id]?.map((lead) => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onCardClick={setSelectedLead}
                  onMoveCard={moveCard}
                />
              ))}
              
              {leadsPorColuna[coluna.id]?.length === 0 && (
                <div className={cn("flex items-center justify-center text-muted-foreground text-sm", 
                  isMobile ? "h-16" : "h-32"
                )}>
                  Nenhum lead nesta etapa
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Detalhes do Lead */}
      <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
        <DialogContent className={cn(isMobile ? "w-[95vw] h-[85vh] max-w-none" : "max-w-2xl")}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Detalhes do Lead
            </DialogTitle>
          </DialogHeader>
          
          {selectedLead && (
            <div className={cn("space-y-6", isMobile && "max-h-[70vh] overflow-y-auto")}>
              {/* Informações Básicas */}
              <div className={cn("grid gap-4", isMobile ? "grid-cols-1" : "grid-cols-2")}>
                <div>
                  <label className="text-sm font-medium">Nome</label>
                  <p className="text-lg">{selectedLead.nome}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Telefone</label>
                  <p className="text-lg">{selectedLead.telefone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Motivo</label>
                  <p>{selectedLead.motivo}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Canal</label>
                  <Badge>{selectedLead.canal}</Badge>
                </div>
              </div>

              {/* Status e Prioridade */}
              <div className={cn("grid gap-4", isMobile ? "grid-cols-1" : "grid-cols-2")}>
                <div>
                  <label className="text-sm font-medium">Status Atual</label>
                  <p className="capitalize">{selectedLead.kanbanStatus.replace('-', ' ')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Prioridade</label>
                  <Badge 
                    variant={selectedLead.prioridade === 'alta' ? 'destructive' : 'secondary'}
                  >
                    {selectedLead.prioridade}
                  </Badge>
                </div>
              </div>

              {/* Datas */}
              <div className={cn("grid gap-4", isMobile ? "grid-cols-1" : "grid-cols-2")}>
                <div>
                  <label className="text-sm font-medium">Data do Contato</label>
                  <p>{new Date(selectedLead.dataContato).toLocaleDateString('pt-BR')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Última Atualização</label>
                  <p>{new Date(selectedLead.dataContato).toLocaleString('pt-BR')}</p>
                </div>
              </div>

              {/* Ações */}
              <div className={cn("flex gap-2 pt-4 border-t", isMobile ? "flex-col" : "")}>
                <Button 
                  className="flex-1"
                  onClick={() => toast.info(`Ligando para ${selectedLead.nome}`)}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Ligar
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => toast.info(`Abrindo WhatsApp de ${selectedLead.nome}`)}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => toast.info(`Agendando consulta para ${selectedLead.nome}`)}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Agendar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}