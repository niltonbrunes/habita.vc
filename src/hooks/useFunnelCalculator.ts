import { useMemo } from 'react';
import { FunnelCalculationResult } from '@/types/funnel';

interface FunnelParams {
  quarterlyGoal: number;
  avgTicket: number;
  avgCommission: number;
  callToPresentation: number;
  presentationToProposal: number;
  proposalToSale: number;
}

export function useFunnelCalculator({
  quarterlyGoal,
  avgTicket,
  avgCommission,
  callToPresentation,
  presentationToProposal,
  proposalToSale
}: FunnelParams): FunnelCalculationResult {
  
  return useMemo(() => {
    // 1. Vendas necessárias (Base)
    const vgvNeeded = quarterlyGoal / ((avgCommission || 1.25) / 100);
    const salesNeeded = Math.ceil(vgvNeeded / (avgTicket || 1));

    // 2. Propostas necessárias (Vendas / Taxa de Fechamento)
    const proposalsNeeded = Math.ceil(salesNeeded / (proposalToSale || 0.01));

    // 3. Apresentações necessárias (Propostas / Taxa de Conversão)
    const presentationsNeeded = Math.ceil(proposalsNeeded / (presentationToProposal || 0.01));

    // 4. Ligações/Leads necessários (Apresentações / Taxa de Agendamento)
    const callsNeeded = Math.ceil(presentationsNeeded / (callToPresentation || 0.01));

    // 5. Meta Diária (Considerando 60 dias úteis no trimestre)
    const dailyLeadGoal = parseFloat((callsNeeded / 60).toFixed(1));

    return {
      salesNeeded,
      proposalsNeeded,
      presentationsNeeded,
      callsNeeded,
      dailyLeadGoal
    };
  }, [quarterlyGoal, avgTicket, avgCommission, callToPresentation, presentationToProposal, proposalToSale]);
}
