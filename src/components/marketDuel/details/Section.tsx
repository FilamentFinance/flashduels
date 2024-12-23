import * as React from "react";
import { SectionProps } from "./types";

export const Section: React.FC<SectionProps> = ({ title, content }) => {
  return (
    <div className="flex overflow-hidden flex-col pt-6 w-full max-md:max-w-full">
      <div className="flex flex-col w-full text-sm font-medium tracking-normal leading-none max-md:max-w-full">
        <div className="flex-wrap gap-1 w-full max-md:max-w-full">{title}</div>
      </div>
      <div className="mt-3 w-full text-xs tracking-normal leading-4 max-md:max-w-full">
        {Array.isArray(content)
          ? content.map((text, index) => (
              <React.Fragment key={index}>
                {text}
                <br />
              </React.Fragment>
            ))
          : content}
      </div>
    </div>
  );
};
