import * as React from "react";
import { ClaimButtonProps } from "./types";

export function ClaimButton({ onClick, disabled }: ClaimButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex-1 shrink gap-2.5 self-stretch px-3 py-2.5 rounded-lg border-solid shadow-sm bg-[linear-gradient(180deg,#F19ED2_0%,#C87ECA_100%)] border-opacity-70 min-w-[240px] size-full disabled:opacity-50"
    >
      Claim Funds
    </button>
  );
}
