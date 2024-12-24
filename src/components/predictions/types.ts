export interface PredictionCardProps {
  imageUrl: string;
  title: string;
  amount: string;
  timeRemaining: string;
  chanceImageUrl: string;
}

export interface PredictionButtonProps {
  label: string;
  variant: "yes" | "no";
}
