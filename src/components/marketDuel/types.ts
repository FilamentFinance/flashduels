export interface OrderItemProps {
  price: string;
  amount: string;
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
