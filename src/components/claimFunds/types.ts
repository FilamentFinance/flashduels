export interface TokenIconProps {
  src: string;
  alt: string;
}

export interface AmountInputProps {
  value: string;
  available: number;
  onMaxClick: () => void;
  onChange: (value: string) => void;
  tokenIcon: TokenIconProps;
  tokenSymbol: string;
}

export interface ClaimButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading: boolean;
}
