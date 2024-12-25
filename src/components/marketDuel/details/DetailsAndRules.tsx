import * as React from "react";
import { Section } from "./Section";

interface DetailsAndRulesProps {
  onClose: () => void; 
}

export const DetailsAndRules: React.FC<DetailsAndRulesProps> = ({ onClose }) => {
  const resolutionContent = [
    "The market will resolve as follows:",
    "Yes: If the Price of $BTC is at or above (equal or more than) $1,20,000, at the end of betting period",
    "No: If the price of $BTC is below (less than) $1,20,000 1 week at the end of betting period",
  ];

  return (
    <div className="flex overflow-hidden flex-col text-white rounded-lg border border-solid shadow-2xl bg-zinc-900 border-zinc-800 max-w-[540px]">
      <div className="flex flex-col w-full max-md:max-w-full">
        <div className="flex flex-col px-6 pb-6 w-full max-md:px-5 max-md:max-w-full">
          <div className="flex relative flex-col py-4 w-full text-2xl font-semibold tracking-normal text-center text-white border-b border-zinc-800 max-md:max-w-full">
            <div className="z-0 max-md:max-w-full">Details And Rules</div>
            <button
            onClick={onClose}
            >
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/8f9b2a938bc8ee4af00b01ed5739d482605cf07e3df13b8d398d6dd7bb06c544?placeholderIfAbsent=true&apiKey=9a4d3cdfd283475dbc30e1b60dc2077d"
              alt=""
              className="object-contain absolute right-3 bottom-5 z-0 w-7 h-7 aspect-square fill-white fill-opacity-10 stroke-[1px] stroke-white stroke-opacity-0"
            />
            </button>
           
          </div>
          <Section title="Resolution Criteria" content={resolutionContent} />
          <Section
            title="Resolution Source"
            content="The resolution is based on price feed from Pyth Oracle"
          />
        </div>
      </div>
    </div>
  );
};
