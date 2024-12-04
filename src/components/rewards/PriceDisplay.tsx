import * as React from "react";
import { PriceDisplayProps } from "./types";

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  amount,
  iconSrc,
}) => {
  return (
    <div className="flex gap-1 justify-center items-center self-stretch my-auto text-base text-stone-200">
      <img
        loading="lazy"
        src={iconSrc}
        alt=""
        className="object-contain shrink-0 self-stretch my-auto aspect-square w-[18px]"
      />
      <div className="self-stretch my-auto">${amount}</div>
    </div>
  );
};
