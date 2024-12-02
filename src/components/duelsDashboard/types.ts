export interface TableHeaderProps {
  label: string;
  width?: string;
  align?: "left" | "right";
}

export interface DuelItemProps {
  icon: string;
  title: string;
  direction: string;
  quantity: string;
  avgPrice: string;
  value: string;
  resolvesIn: string;
  directionColor?: string;
}

export interface TableCellProps {
  children: React.ReactNode;
  width?: string;
  align?: "left" | "right";
}
