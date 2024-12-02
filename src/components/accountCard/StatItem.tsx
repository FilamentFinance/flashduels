import * as React from "react";
import { StatItemProps } from "./types";

export function StatItem({
  label,
  value,
  valueColor = "text-white",
}: StatItemProps) {
  return (
    <div className="flex justify-between items-center py-0.5 w-full">
      <div className="flex-1 shrink gap-1 self-stretch my-auto text-gray-500">
        {label}
      </div>
      <div className={`self-stretch my-auto text-right text-${valueColor}`}>
        {value}
      </div>
    </div>
  );
}
