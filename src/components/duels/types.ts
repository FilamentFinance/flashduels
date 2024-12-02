export interface DuelFilterOption {
  label: string;
  isActive?: boolean;
}

export interface DuelFilterProps {
  options: DuelFilterOption[];
  onOptionSelect?: (index: number) => void;
}
