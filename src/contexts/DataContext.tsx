import React, { createContext, useContext, useState, ReactNode } from 'react';

// Tipos
export interface Lead {
  id: string;
  nome: string;
  telefone: string;
  dataContato: string;
  statusContato: '1º Consulta' | 'Paciente' | 'Retorno' | 'Procedimento' | 'Outros';
  motivo: string;
  agendamento: 'Sim' | 'Não';
  tipoConsulta: 'Plano de Saúde' | 'Particular' | 'Outros';
  objecao: 'Localidade' | 'Plano de Saúde' | 'Preço' | 'Horário' | 'Não responde' | 'Outra' | 'Nenhuma';
  canal: 'Google' | 'Instagram' | 'YouTube' | 'Indicação';
  followUp: 'Agendado' | 'Prefere Aguardar' | 'Não responde' | 'Não há interesse' | 'Outro';
  kanbanStatus: 'inicio' | 'qualificacao-lead' | 'qualificacao-consulta' | 'agendado';
  prioridade: 'alta' | 'media' | 'baixa';
  observacoes?: string;
}

interface DataContextType {
  leads: Lead[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
  addLead: (lead: Omit<Lead, 'id'>) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  getStats: () => {
    totalAgendamentos: number;
    novosLeads: number;
    taxaConversao: number;
    leadsAtivos: number;
    comparacao: {
      totalAgendamentos: number;
      novosLeads: number;
      taxaConversao: number;
      leadsAtivos: number;
    };
  };
  getChartData: () => {
    contatosPorCanal: Array<{ name: string; value: number; color: string }>;
    agendamentosPorCanal: Array<{ name: string; value: number; color: string }>;
    objecoes: Array<{ name: string; quantidade: number }>;
    funil: Array<{ name: string; value: number; fill: string }>;
  };
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Dados simulados
const initialLeads: Lead[] = [
  {
    id: '1',
    nome: 'Maria Silva',
    telefone: '(11) 99999-9999',
    dataContato: '2024-01-15',
    statusContato: '1º Consulta',
    motivo: 'Dor nas costas',
    agendamento: 'Sim',
    tipoConsulta: 'Plano de Saúde',
    objecao: 'Nenhuma',
    canal: 'Google',
    followUp: 'Agendado',
    kanbanStatus: 'agendado',
    prioridade: 'alta',
  },
  {
    id: '2',
    nome: 'João Santos',
    telefone: '(11) 88888-8888',
    dataContato: '2024-01-14',
    statusContato: '1º Consulta',
    motivo: 'Consulta de rotina',
    agendamento: 'Não',
    tipoConsulta: 'Particular',
    objecao: 'Horário',
    canal: 'Instagram',
    followUp: 'Prefere Aguardar',
    kanbanStatus: 'qualificacao-lead',
    prioridade: 'media',
  },
  {
    id: '3',
    nome: 'Ana Costa',
    telefone: '(11) 77777-7777',
    dataContato: '2024-01-13',
    statusContato: 'Paciente',
    motivo: 'Dor de cabeça',
    agendamento: 'Sim',
    tipoConsulta: 'Particular',
    objecao: 'Nenhuma',
    canal: 'YouTube',
    followUp: 'Agendado',
    kanbanStatus: 'qualificacao-consulta',
    prioridade: 'alta',
  },
  {
    id: '4',
    nome: 'Pedro Oliveira',
    telefone: '(11) 66666-6666',
    dataContato: '2024-01-12',
    statusContato: 'Retorno',
    motivo: 'Dor no joelho',
    agendamento: 'Sim',
    tipoConsulta: 'Plano de Saúde',
    objecao: 'Nenhuma',
    canal: 'Indicação',
    followUp: 'Agendado',
    kanbanStatus: 'agendado',
    prioridade: 'media',
  },
  {
    id: '5',
    nome: 'Carla Ferreira',
    telefone: '(11) 55555-5555',
    dataContato: '2024-01-11',
    statusContato: '1º Consulta',
    motivo: 'Consulta preventiva',
    agendamento: 'Não',
    tipoConsulta: 'Plano de Saúde',
    objecao: 'Preço',
    canal: 'Google',
    followUp: 'Não responde',
    kanbanStatus: 'inicio',
    prioridade: 'baixa',
  },
  // Dados do período anterior para comparação
  {
    id: '6',
    nome: 'Roberto Lima',
    telefone: '(11) 44444-4444',
    dataContato: '2023-12-15',
    statusContato: '1º Consulta',
    motivo: 'Check-up',
    agendamento: 'Sim',
    tipoConsulta: 'Particular',
    objecao: 'Nenhuma',
    canal: 'Google',
    followUp: 'Agendado',
    kanbanStatus: 'agendado',
    prioridade: 'media',
  },
  {
    id: '7',
    nome: 'Lucia Pereira',
    telefone: '(11) 33333-3333',
    dataContato: '2023-12-14',
    statusContato: 'Paciente',
    motivo: 'Dor muscular',
    agendamento: 'Não',
    tipoConsulta: 'Plano de Saúde',
    objecao: 'Localidade',
    canal: 'Instagram',
    followUp: 'Não há interesse',
    kanbanStatus: 'inicio',
    prioridade: 'baixa',
  },
];

export function DataProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);

  const addLead = (leadData: Omit<Lead, 'id'>) => {
    const newLead: Lead = {
      ...leadData,
      id: Date.now().toString(),
    };
    setLeads(prev => [...prev, newLead]);
  };

  const updateLead = (id: string, updates: Partial<Lead>) => {
    setLeads(prev => prev.map(lead => 
      lead.id === id ? { ...lead, ...updates } : lead
    ));
  };

  const deleteLead = (id: string) => {
    setLeads(prev => prev.filter(lead => lead.id !== id));
  };

  const getStats = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    // Dados do mês atual
    const currentMonthLeads = leads.filter(lead => {
      const leadDate = new Date(lead.dataContato);
      return leadDate.getMonth() === currentMonth && leadDate.getFullYear() === currentYear;
    });

    // Dados do mês anterior
    const lastMonthLeads = leads.filter(lead => {
      const leadDate = new Date(lead.dataContato);
      return leadDate.getMonth() === lastMonth && leadDate.getFullYear() === lastMonthYear;
    });

    const totalAgendamentos = currentMonthLeads.filter(lead => lead.agendamento === 'Sim').length;
    const novosLeads = currentMonthLeads.length;
    const taxaConversao = novosLeads > 0 ? Math.round((totalAgendamentos / novosLeads) * 100) : 0;
    const leadsAtivos = currentMonthLeads.filter(lead => 
      lead.followUp !== 'Não há interesse' && lead.kanbanStatus !== 'agendado'
    ).length;

    // Comparações
    const lastTotalAgendamentos = lastMonthLeads.filter(lead => lead.agendamento === 'Sim').length;
    const lastNovosLeads = lastMonthLeads.length;
    const lastTaxaConversao = lastNovosLeads > 0 ? Math.round((lastTotalAgendamentos / lastNovosLeads) * 100) : 0;
    const lastLeadsAtivos = lastMonthLeads.filter(lead => 
      lead.followUp !== 'Não há interesse' && lead.kanbanStatus !== 'agendado'
    ).length;

    return {
      totalAgendamentos,
      novosLeads,
      taxaConversao,
      leadsAtivos,
      comparacao: {
        totalAgendamentos: lastTotalAgendamentos > 0 ? Math.round(((totalAgendamentos - lastTotalAgendamentos) / lastTotalAgendamentos) * 100) : 0,
        novosLeads: lastNovosLeads > 0 ? Math.round(((novosLeads - lastNovosLeads) / lastNovosLeads) * 100) : 0,
        taxaConversao: lastTaxaConversao > 0 ? Math.round(((taxaConversao - lastTaxaConversao) / lastTaxaConversao) * 100) : 0,
        leadsAtivos: lastLeadsAtivos > 0 ? Math.round(((leadsAtivos - lastLeadsAtivos) / lastLeadsAtivos) * 100) : 0,
      }
    };
  };

  const getChartData = () => {
    // Contagem de todos os leads por canal (Canal de Contato)
    const canalContatoCounts = leads.reduce((acc, lead) => {
      acc[lead.canal] = (acc[lead.canal] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Contagem apenas de leads agendados por canal (Canal de Agendamento)
    const canalAgendamentoCounts = leads.reduce((acc, lead) => {
      if (lead.agendamento === 'Sim') {
        acc[lead.canal] = (acc[lead.canal] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const contatosPorCanal = [
      { name: 'Google', value: canalContatoCounts.Google || 0, color: '#04BF8A' },
      { name: 'Instagram', value: canalContatoCounts.Instagram || 0, color: '#0A0A20' },
      { name: 'YouTube', value: canalContatoCounts.YouTube || 0, color: '#5EE0A9' },
      { name: 'Indicação', value: canalContatoCounts.Indicação || 0, color: '#CCCCCC' },
    ];

    const agendamentosPorCanal = [
      { name: 'Google', value: canalAgendamentoCounts.Google || 0, color: '#04BF8A' },
      { name: 'Instagram', value: canalAgendamentoCounts.Instagram || 0, color: '#0A0A20' },
      { name: 'YouTube', value: canalAgendamentoCounts.YouTube || 0, color: '#5EE0A9' },
      { name: 'Indicação', value: canalAgendamentoCounts.Indicação || 0, color: '#CCCCCC' },
    ];

    const objecaoCounts = leads.reduce((acc, lead) => {
      if (lead.objecao !== 'Nenhuma') {
        acc[lead.objecao] = (acc[lead.objecao] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const objecoes = Object.entries(objecaoCounts).map(([name, quantidade]) => ({
      name,
      quantidade
    }));

    const statusCounts = leads.reduce((acc, lead) => {
      acc[lead.kanbanStatus] = (acc[lead.kanbanStatus] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const funil = [
      { name: 'Primeiro Contato', value: statusCounts.inicio || 0, fill: 'hsl(var(--chart-1))' },
      { name: 'Qualificação do Lead', value: statusCounts['qualificacao-lead'] || 0, fill: 'hsl(var(--chart-2))' },
      { name: 'Qualificação da Consulta', value: statusCounts['qualificacao-consulta'] || 0, fill: 'hsl(var(--chart-3))' },
      { name: 'Agendamentos Confirmados', value: statusCounts.agendado || 0, fill: 'hsl(var(--chart-4))' },
    ];

    return {
      contatosPorCanal,
      agendamentosPorCanal,
      objecoes,
      funil
    };
  };

  const value: DataContextType = {
    leads,
    setLeads,
    addLead,
    updateLead,
    deleteLead,
    getStats,
    getChartData,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}