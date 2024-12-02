export interface StatItemProps {
  label: string;
  value: string;
  valueColor?: string;
}

export interface AccountCardProps {
  // username: string;
  address: string;
  accountValue: string;
  stats: StatItemProps[];
}
