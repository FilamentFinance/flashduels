import React from "react";

interface CategorySelectProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const TokenSelect: React.FC<CategorySelectProps> = ({ name, value, onChange }) => {
  // Define the options directly within the component
  const options = [
    { value: "BTC", label: "BTC" },
    { value: "ETH", label: "ETH" },
    { value: "SOL", label: "SOL" },
  ];

  return (
    <div className="flex flex-col w-full">
      <label
        htmlFor={name} // Use name for the label association
        className="flex gap-1 items-center max-w-full text-base tracking-normal leading-none text-gray-400 whitespace-nowrap w-[254px] rounded-lg"
      >
        <span className="gap-1 self-stretch my-auto tracking-tighter min-w-[240px] w-[284px]">
          Token*
        </span>
      </label>
      <div className="flex flex-col mt-1 w-full bg-neutral-800">
        <div className="flex overflow-hidden items-center w-full rounded-lg ">
          <select
            id={name} // Use name for the id
            name={name}
            value={value}
            onChange={onChange}
            className="flex-1 shrink items-center self-stretch my-auto text-base font-medium tracking-normal bg-neutral-800 text-gray-500 whitespace-nowrap basis-5 min-w-[240px] py-2.5 pr-2 pl-3 rounded-lg"
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {/* <div className="flex gap-2 items-center self-stretch py-2.5 pr-3 pl-2 my-auto w-[34px]">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/2a9032215ec5598277da097be2b91978a703359cca58633128c85517d3c75d50?placeholderIfAbsent=true&apiKey=9a4d3cdfd283475dbc30e1b60dc2077d"
              alt=""
              className="object-contain self-stretch my-auto w-3.5 aspect-square"
            />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default TokenSelect;
