import React from "react";

interface CategorySelectProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const WinConditionSelect: React.FC<CategorySelectProps> = ({name, value, onChange}) => {
  return (
    <div className="flex gap-1 items-center mt-4 w-full">
      <label
        htmlFor="win-condition-select"
        className="flex flex-1 shrink gap-1 items-center self-stretch my-auto text-base tracking-normal leading-none text-gray-400 basis-0"
      >
        <span className=" self-stretch my-auto min-w-full w-full tracking-tighter">
          Win Condition
        </span>
      </label>
      <div className="flex flex-col flex-1 shrink self-stretch my-auto basis-0">
        <div className="flex overflow-hidden items-center w-full rounded-lg border border-solid shadow-sm bg-lime-500 bg-opacity-20 border-lime-500 border-opacity-30">
          <select
            id="win-condition-select"
            name={name} value={value} onChange={onChange} 
            className="flex flex-1 shrink items-center self-stretch my-auto text-base font-medium tracking-normal basis-5 text-stone-200 bg-transparent border-none appearance-none pr-2 pl-3 py-2.5"
          >
            <option>Above</option>
            <option>Below</option>
          </select>
          <div className="flex gap-2 items-center self-stretch py-2.5 pr-3 pl-2 my-auto w-[34px]">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/e6e841b334bd62a65114555ae82f86638faa8a3343b72bec28dca66c940934fc?placeholderIfAbsent=true&apiKey=9a4d3cdfd283475dbc30e1b60dc2077d"
              alt=""
              className="object-contain self-stretch my-auto w-3.5 aspect-square"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WinConditionSelect;
