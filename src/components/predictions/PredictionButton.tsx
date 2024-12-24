import * as React from "react";
import { PredictionButtonProps } from "./types";

export const PredictionButton: React.FC<PredictionButtonProps> = ({
  label,
  variant,
}) => {
  const baseStyles: React.CSSProperties = {
    flex: 1,
    flexShrink: 1,
    gap: "2.5rem",
    alignSelf: "stretch",
    padding: "0.75rem",
    textAlign: "center",
    borderRadius: "0.5rem", // Equivalent to rounded-lg
    border: "1px solid", // Equivalent to border border-solid
  };
  

  const variantStyles: React.CSSProperties =
    variant === "yes"
      ? {
          border: "1px solid rgba(152, 239, 42, 0.20)",
          background: "rgba(75, 249, 15, 0.05)",
          boxShadow: "0px 0px 4px 0px rgba(149, 222, 100, 0.50) inset",
          color: "lime",
        }
      : {
          border: "1px solid rgba(248, 20, 22, 0.10)",
          background: "rgba(248, 20, 22, 0.10)",
          boxShadow: "0px 0px 4px 0px rgba(214, 84, 84, 0.60) inset",
          color: "red",
        };

  return (
    <button
      style={{ ...baseStyles, ...variantStyles }}
      aria-label={`Vote ${label}`}
    >
      {label}
    </button>
  );
};
