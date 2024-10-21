import React, { useState } from "react";

interface DurationSelectProps {
  name: string;
  value: string;
  onChange: (duration: string) => void;
}

const DurationSelect: React.FC<DurationSelectProps> = ({onChange}) => {
  const durations = ["3H", "6H", "12H", "24H", "48H"];
  const [selectedDuration, setSelectedDuration] = useState<string>("3H"); // Set default duration

  const handleDurationClick = (duration: string) => {
    setSelectedDuration(duration); // Update the selected duration
    onChange(duration);
  };

  return (
    <div className="flex flex-col mt-4 w-full">
      <div className="flex gap-1 items-center w-full">
        <label
          htmlFor="duration-select"
          className="flex flex-1 shrink gap-1 items-center self-stretch my-auto w-full"
        >
          <span className="flex-1 shrink gap-1 tracking-tighter self-stretch my-auto text-base tracking-normal leading-none text-gray-400">
            Ends in
          </span>
        </label>
        <div className="flex overflow-hidden justify-center self-stretch p-0.5 my-auto text-sm tracking-normal leading-none text-center whitespace-nowrap rounded-lg border border-solid bg-zinc-500 bg-opacity-10 border-gray-500 border-opacity-50 text-stone-200">
          {durations.map((duration) => (
            <button
              key={duration}
              type="button"
              onClick={() => handleDurationClick(duration)} // Set active duration
              className={`self-stretch px-2.5 py-1 h-full ${
                selectedDuration === duration
                  ? "font-semibold bg-[linear-gradient(180deg,#F19ED2_0%,#C87ECA_100%)] rounded-lg"
                  : ""
              }`}
            >
              {duration}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DurationSelect;
