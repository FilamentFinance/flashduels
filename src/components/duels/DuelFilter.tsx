import * as React from "react";
import { FilterOption } from "./FilterOption";
import type { DuelFilterProps } from "./types";

export function DuelFilter({ options, onOptionSelect }: DuelFilterProps) {
  return (
    <div className="flex overflow-hidden justify-center self-stretch p-1 my-auto text-base text-center rounded-lg border border-solid bg-white bg-opacity-0 border-white border-opacity-10 min-w-[240px] text-stone-200">
      {options.map((option, index) => (
        <React.Fragment key={option.label}>
          <FilterOption
            label={option.label}
            isActive={option.isActive}
            onClick={() => onOptionSelect?.(index)}
          />
          {index < options.length - 1 && (
            <div className="flex shrink-0 my-auto w-px h-3 rounded-sm bg-blend-normal" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
