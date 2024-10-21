import React from "react";

interface ProbabilityBarProps {
  probability: number;
}

const ProbabilityBar: React.FC<ProbabilityBarProps> = ({ probability }) => {
  const filledBars = Math.round(probability / 10);
  const emptyBars = 10 - filledBars;

  return (
    <div className="flex flex-col justify-center self-stretch my-auto w-[62px]">
      <div className="flex flex-col justify-center w-full min-h-[36px]">
        <div className="self-center text-base font-semibold leading-none text-lime-300">
          {probability}%
        </div>
        <div className="flex gap-0.5 mt-1 w-full min-h-[13px]">
          {[...Array(filledBars)].map((_, index) => (
            <div
              key={`filled-${index}`}
              className="flex flex-1 shrink w-1 bg-lime-300 rounded-xl basis-0 h-[13px]"
            />
          ))}
          {[...Array(emptyBars)].map((_, index) => (
            <div
              key={`empty-${index}`}
              className="flex flex-1 shrink w-1 rounded-xl basis-0 bg-gray-500 bg-opacity-30 h-[13px]"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProbabilityBar;
