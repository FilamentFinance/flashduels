import React from "react";

interface CategorySelectProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const CategorySelect: React.FC<CategorySelectProps> = ({ name, value, onChange }) => {

  return (
    <div className="flex mt-2 flex-row w-full">
      <label
        htmlFor="category"
        className="flex gap-1 items-center w-full text-base leading-none text-gray-400 whitespace-nowrap min-w-[240px] w-[254px]"
      >
        Category*
      </label>
      <div className="flex flex-col flex-1 shrink self-stretch my-auto basis-0 bg-neutral-800">
        <div className="flex overflow-hidden items-center w-full rounded-lg border border-solid shadow-sm bg-white bg-opacity-0 border-white border-opacity-10">
          <select
            id="category"
            name={name} value={value} onChange={onChange} 
            required
            className="flex flex-1 text-white shrink items-center self-stretch my-auto p-2 text-base font-medium tracking-normal whitespace-nowrap basis-5 text-stone-500 bg-transparent appearance-none"
          >
            <option>Any</option>
            {/* <option>Crypto</option> */}
            <option>Politics</option>
            <option>Sports</option>
            {/* <option>Twitter</option>
            <option>NFTs</option>
            <option>News</option> */}
          </select>
          <div className="flex gap-2 items-center self-stretch py-2.5 pr-3 pl-2 my-auto w-[34px]">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/2d637349b842a378e71c30b463bed8fc1296de2b4d63bf67115c4e9f175182d1?placeholderIfAbsent=true&apiKey=9a4d3cdfd283475dbc30e1b60dc2077d"
              alt=""
              className="object-contain self-stretch my-auto w-3.5 aspect-square"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategorySelect;
