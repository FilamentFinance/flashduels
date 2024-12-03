export interface StatItemProps {
  label: string;
  value: string;
  valueColor?: string;
}

export interface AccountCardProps {
  // username: string;
  shortenAddress: string;
  accountValue: string;
  stats: StatItemProps[];
}
