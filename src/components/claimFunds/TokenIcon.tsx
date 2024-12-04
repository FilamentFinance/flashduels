import * as React from "react";
import { TokenIconProps } from "./types";

export function TokenIcon({ src, alt }: TokenIconProps) {
  return (
    <img
      loading="lazy"
      src={src}
      alt={alt}
      className="object-contain shrink-0 self-stretch my-auto aspect-square rounded-[999px] w-[26px]"
    />
  );
}
