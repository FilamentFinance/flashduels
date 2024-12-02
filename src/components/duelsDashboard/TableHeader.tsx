import * as React from "react";
import { TableHeaderProps } from "./types";

export function TableHeader({
  label,
  width,
  align = "left",
}: TableHeaderProps) {
  return (
    <div
      className={`flex gap-2.5 items-start p-2 ${width || ""} ${
        align === "right" ? "text-right" : ""
      } whitespace-nowrap border-t border-b border-neutral-800`}
    >
      <div className="flex flex-1 shrink gap-2 items-start w-full basis-0">
        <div className="flex flex-col flex-1 shrink w-full basis-0">
          <div className="flex gap-1 items-center w-full">
            <div className="overflow-hidden flex-1 shrink gap-1 self-stretch my-auto w-full text-ellipsis">
              {label}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
