import * as React from "react";
import { DuelItemProps } from "./types";
import { TableCell } from "./TableCell";

export function DuelItem({
  icon,
  title,
  direction,
  quantity,
  avgPrice,
  value,
  resolvesIn,
  directionColor,
}: DuelItemProps) {
  return (
    <div className="flex items-start w-full max-md:max-w-full">
      <div className="flex flex-wrap flex-1 shrink w-full border-b basis-0 bg-white bg-opacity-0 border-gray-200 border-opacity-0 min-w-[240px] max-md:max-w-full">
        <div className="flex gap-2 items-center pr-2 pl-4 my-auto border-neutral-800 min-h-[44px] w-[188px]">
          <div className="flex gap-2 self-stretch my-auto min-h-[18px] w-[18px]">
            <div className="flex flex-1 shrink basis-0 size-full">
              <div className="flex flex-1 shrink justify-center items-center bg-gray-500 rounded-md border border-solid basis-0 border-white border-opacity-10 h-[18px] w-[18px]">
                <img
                  loading="lazy"
                  src={icon}
                  alt=""
                  className="object-contain flex-1 shrink rounded-md aspect-square basis-0 w-[18px]"
                />
              </div>
            </div>
          </div>
          <div className="flex-1 shrink gap-2.5 self-stretch my-auto text-xs font-semibold leading-none text-white w-[150px]">
            {title}
          </div>
        </div>
        <div
          className={`flex gap-2.5 items-center self-stretch py-3 pr-2 pl-4 h-auto text-xs font-medium tracking-normal leading-none ${directionColor} whitespace-nowrap border-b border-neutral-800 w-[90px]`}
        >
          {direction}
        </div>
        <TableCell width="w-[79px]">{quantity}</TableCell>
        <TableCell width="w-28">{avgPrice}</TableCell>
        <TableCell width="w-28">{value}</TableCell>
        <TableCell width="flex-1 shrink basis-0 min-w-[240px]">
          {resolvesIn}
        </TableCell>
      </div>
    </div>
  );
}
