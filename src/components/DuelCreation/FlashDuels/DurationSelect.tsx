import React, { useState } from "react";

const durations = ["5M", "15M", "30M", "1H", "3H", "6H", "12H"];

interface DurationSelectProps {
  name: string;
  value: string;
  onChange: (duration: string) => void;
}

const DurationSelect: React.FC<DurationSelectProps> = ({
  name,
  value,
  onChange,
}) => {
  // State to keep track of the selected duration
  const [selectedDuration, setSelectedDuration] = useState<string | null>(
    value
  );

  const handleDurationSelect = (duration: string) => {
    setSelectedDuration(duration); // Update selected duration
    onChange(duration); // Call the onChange handler with selected duration
  };

  return (
    <div className="flex flex-col mt-2 w-full ">
      <div className="flex gap-1 items-center w-full">
        <div className="flex flex-1 shrink gap-1 items-center self-stretch my-auto w-full basis-0 min-w-[240px]">
          <label
            htmlFor="duration"
            className="flex-1 shrink gap-1 self-stretch my-auto text-base tracking-normal leading-none text-gray-400"
          >
            Ends in
          </label>
          <div className="flex overflow-hidden justify-center self-stretch p-0.5 my-auto text-sm tracking-normal leading-none text-center whitespace-nowrap rounded-lg border border-solid bg-neutral-800 border-zinc-800 bg-opacity border-opacity-50 text-stone-200">
            {durations.map((duration) => (
              <button
                key={duration}
                type="button"
                onClick={() => handleDurationSelect(duration)} // Set selected duration on click
                className={`self-stretch px-2.5 py-1 h-full ${
                  selectedDuration === duration // Check if this duration is selected
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
      <input type="hidden" name={name} value={selectedDuration || ""} />
    </div>
  );
};

export default DurationSelect;
