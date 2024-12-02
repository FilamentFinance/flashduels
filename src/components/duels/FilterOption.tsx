import * as React from "react";

interface FilterOptionProps {
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

export function FilterOption({ label, isActive, onClick }: FilterOptionProps) {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
      className="flex relative gap-4 items-start px-4 py-1 h-full leading-none text-white rounded-lg"
    >
      {isActive && (
        <div className="flex absolute inset-y-0 left-0 right-px z-0 shrink-0 items-center self-start h-7 rounded-lg border-solid shadow-sm bg-[linear-gradient(180deg,#F19ED2_0%,#C87ECA_100%)] border-[0.5px] border-black border-opacity-0 w-[58px]" />
      )}
      <div className="z-0 my-auto text-ellipsis">{label}</div>
    </div>
  );
}
