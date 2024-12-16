import * as React from "react";
import { MarketStatsProps } from "./types";

export const MarketStats: React.FC<MarketStatsProps> = ({
  label,
  value,
  suffix,
}) => {
  return (
    <div className="flex flex-1 shrink items-center self-stretch my-auto basis-0">
      <div className="flex flex-col flex-1 shrink justify-center self-stretch my-auto w-full basis-0">
        <div className="text-base tracking-normal leading-none text-gray-400">
          {label}
        </div>
        <div className="gap-2 self-start mt-1 text-xl font-semibold tracking-normal leading-none whitespace-nowrap text-stone-200">
          {value}
          {suffix && ` ${suffix}`}
        </div>
      </div>
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/4bd09ea4570a4d12834637c604f75b6a/e905e372441b8b21b79fcd550a4757cacc7141d731fdc97b955497356324005b?apiKey=0079b6be27434c51a81de1c6567570a7&"
        className="object-contain shrink-0 self-stretch my-auto w-0"
        alt=""
      />
    </div>
  );
};
