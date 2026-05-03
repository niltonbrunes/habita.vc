export interface FunnelResults {
  monthlyGoal: number;
  annualGoal: number;
  requiredVgv: number;
  requiredSales: number;
  requiredProposals: number;
  requiredVisits: number;
  requiredPresentations: number;
  requiredContacts: number;
  requiredLeads: number;
}

export interface FunnelRates {
  proposalToSale: number;
  visitToProposal: number;
  presentationToVisit: number;
  contactToPresentation: number;
  leadToContact: number;
}

export const DEFAULT_RATES: FunnelRates = {
  proposalToSale: 0.50, // 50%
  visitToProposal: 0.20, // 20%
  presentationToVisit: 0.40, // 40%
  contactToPresentation: 0.30, // 30%
  leadToContact: 0.20, // 20%
};

export function calculateReverseFunnel(
  monthlyGoal: number,
  avgTicket: number,
  avgCommissionPercent: number,
  rates: FunnelRates = DEFAULT_RATES
): FunnelResults {
  const annualGoal = monthlyGoal * 12;
  const requiredVgv = monthlyGoal / (avgCommissionPercent / 100);
  const requiredSales = Math.ceil(requiredVgv / avgTicket);
  
  // Reverse calculations
  const requiredProposals = Math.ceil(requiredSales / rates.proposalToSale);
  const requiredVisits = Math.ceil(requiredProposals / rates.visitToProposal);
  const requiredPresentations = Math.ceil(requiredVisits / rates.presentationToVisit);
  const requiredContacts = Math.ceil(requiredPresentations / rates.contactToPresentation);
  const requiredLeads = Math.ceil(requiredContacts / rates.leadToContact);

  return {
    monthlyGoal,
    annualGoal,
    requiredVgv,
    requiredSales,
    requiredProposals,
    requiredVisits,
    requiredPresentations,
    requiredContacts,
    requiredLeads
  };
}
