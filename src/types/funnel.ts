export interface FunnelStage {
  id: string;
  name: string;
  volume: number;
  conversionRate: number; // Taxa para a PRÓXIMA etapa
}

export interface BrokerFunnelConfig {
  brokerId: string;
  quarterlyGoal: number;
  avgTicket: number;
  stages: {
    calls: number;
    presentations: number;
    proposals: number;
    sales: number;
  };
  conversionRates: {
    callToPresentation: number; // ex: 0.20
    presentationToProposal: number; // ex: 0.30
    proposalToSale: number; // ex: 0.40
  };
  channels: {
    name: string;
    percentage: number;
    leads: number;
  }[];
  lastUpdated: string;
}

export interface FunnelCalculationResult {
  salesNeeded: number;
  proposalsNeeded: number;
  presentationsNeeded: number;
  callsNeeded: number;
  dailyLeadGoal: number;
}
