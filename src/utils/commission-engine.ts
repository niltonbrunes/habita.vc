export type CommissionType = 'launch' | 'resale' | 'high_end' | 'independent' | 'custom';

export interface CommissionSplit {
  participantRole: 'capturer' | 'seller' | 'manager' | 'house';
  participantName: string;
  percentage: number;
  value: number;
}

export interface CommissionResult {
  totalValue: number;
  totalPercentage: number;
  splits: CommissionSplit[];
}

export const COMMISSION_RULES = {
  launch: { min: 1.85, max: 2.30 },
  resale: { capturer: 1.25, seller: 1.25, total: 2.5 },
  high_end: { min: 2.5, max: 3.0 },
  independent: { min: 5.0, max: 6.0 },
};

export function calculateCommission(
  salePrice: number,
  type: CommissionType,
  customPercent?: number,
  participants?: { role: 'capturer' | 'seller', name: string }[]
): CommissionResult {
  let totalPercentage = customPercent || 0;

  if (!customPercent) {
    switch (type) {
      case 'launch':
        totalPercentage = COMMISSION_RULES.launch.max;
        break;
      case 'resale':
        totalPercentage = COMMISSION_RULES.resale.total;
        break;
      case 'high_end':
        totalPercentage = COMMISSION_RULES.high_end.max;
        break;
      case 'independent':
        totalPercentage = COMMISSION_RULES.independent.max;
        break;
    }
  }

  const totalValue = salePrice * (totalPercentage / 100);
  const splits: CommissionSplit[] = [];

  if (type === 'resale' && !customPercent) {
    // Standard resale split
    splits.push({
      participantRole: 'capturer',
      participantName: participants?.find(p => p.role === 'capturer')?.name || 'Corretor Captador',
      percentage: COMMISSION_RULES.resale.capturer,
      value: salePrice * (COMMISSION_RULES.resale.capturer / 100)
    });
    splits.push({
      participantRole: 'seller',
      participantName: participants?.find(p => p.role === 'seller')?.name || 'Corretor Vendedor',
      percentage: COMMISSION_RULES.resale.seller,
      value: salePrice * (COMMISSION_RULES.resale.seller / 100)
    });
  } else {
    // Single participant or custom split (simplified for now)
    splits.push({
      participantRole: 'seller',
      participantName: participants?.[0]?.name || 'Corretor',
      percentage: totalPercentage,
      value: totalValue
    });
  }

  return {
    totalValue,
    totalPercentage,
    splits
  };
}
