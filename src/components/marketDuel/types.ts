export interface OrderItemProps {
  price: number;
  amount: number;
  type: string;
  onBuy: () => void;
}

export interface MarketStatsProps {
  label: string;
  value: string;
  suffix?: string;
}

export interface WalletBalanceProps {
  amount: string;
  currency: string;
  onClaim?: () => void;
  onDeposit?: () => void;
}
