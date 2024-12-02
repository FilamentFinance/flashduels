import * as React from "react";
import { TableCellProps } from "./types";

export function TableCell({ children, width, align = "left" }: TableCellProps) {
  return (
    <div
      className={`flex gap-2.5 items-center px-2 py-3 ${
        width || ""
      } h-full text-sm font-medium tracking-normal leading-none text-white whitespace-nowrap border-b border-neutral-800`}
    >
      <div
        className={`flex gap-2 items-center self-stretch my-auto ${
          width || "w-full"
        }`}
      >
        <div className="flex flex-col flex-1 shrink justify-center self-stretch my-auto w-full basis-0">
          <div
            className={`flex-1 shrink gap-1 self-stretch w-full text-ellipsis ${
              align === "right" ? "text-right" : ""
            }`}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
