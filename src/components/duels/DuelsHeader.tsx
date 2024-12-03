"use client"
import * as React from "react";
// import DuelGrid from "../DuelGrid";
// import { DuelFilter } from "./DuelFilter";

export function DuelsHeader({ activeButton, setActiveButton }: { activeButton: string, setActiveButton: (activeButton: string) => void }) {
  // const [activeFilterIndex, setActiveFilterIndex] = React.useState(0);
  const handleLiveDuelsClick = () => {
    console.log('Live Duels clicked!');
    setActiveButton('liveDuels'); // Set active button
    // Add your logic for Live Duels here
  };

  const handleBootstrappingClick = () => {
    console.log('Bootstrapping clicked!');
    setActiveButton('bootstrapping'); // Set active button
    // Add your logic for Bootstrapping here
  };

  const handleCompletedClick = () => {
    console.log('Completed clicked!');
    setActiveButton('completed'); // Set active button
    // Add your logic for Completed here
  };
  // const filterOptions = [
  //   { label: "Live", isActive: activeFilterIndex === 0 },
  //   { label: "Bootstrapping", isActive: activeFilterIndex === 1 },
  //   { label: "Completed", isActive: activeFilterIndex === 2 },
  // ];

  return (
    <div className="flex flex-wrap mt-[15px] items-center w-full min-h-[26px] max-md:max-w-full">
      <div className="flex-1 shrink gap-2.5 self-stretch my-auto text-2xl font-semibold leading-none text-white min-w-[240px] max-md:max-w-full">
        Your Duels
      </div>
      <div className="flex overflow-hidden justify-start font-bold   h-full text-base text-center rounded-lg bg-white bg-opacity-0 min-w-[240px] text-stone-200">
        <div className="flex border border-solid border-white border-opacity-10 rounded-lg">
          <button
            onClick={handleLiveDuelsClick}
            className={`self-stretch px-2.5 py-1 h-full tracking-normal whitespace-nowrap text-ellipsis w-[121px] bg-transparent border-none cursor-pointer text-stone-200 
        ${activeButton === 'liveDuels' ?
                'rounded-lg border border-solid border-opacity-30 bg-[linear-gradient(180deg,#EF9DD2_0%,#CB80CB_100%)] shadow-[0px_0px_4.3px_rgba(255,255,255,0.20)_inset] text-black'
                : 'rounded-lg hover:bg-stone-600 transition duration-200'
              }`}
          >
            Live Duels
          </button>

          <button
            onClick={handleBootstrappingClick}
            className={`self-stretch px-2.5 py-1 h-full tracking-normal whitespace-nowrap text-ellipsis w-[141px] bg-transparent border-none cursor-pointer text-stone-200 
        ${activeButton === 'bootstrapping' ?
          'rounded-lg border border-solid border-opacity-30 text-black bg-[linear-gradient(180deg,#EF9DD2_0%,#CB80CB_100%)] shadow-[0px_0px_4.3px_rgba(255,255,255,0.20)_inset]'
          : 'rounded-lg hover:bg-stone-600 transition duration-200'
        }`}
          >
            Bootstrapping
          </button>

          <button
            onClick={handleCompletedClick}
            className={`self-stretch px-2.5 py-1 h-full tracking-normal whitespace-nowrap text-ellipsis w-[121px] bg-transparent border-none cursor-pointer text-stone-200 
        ${activeButton === 'completed' ?
                'rounded-lg border border-solid border-opacity-30 text-black bg-[linear-gradient(180deg,#EF9DD2_0%,#CB80CB_100%)] shadow-[0px_0px_4.3px_rgba(255,255,255,0.20)_inset]'
                : 'rounded-lg hover:bg-stone-600 transition duration-200'
              }`}
          >
            Completed
          </button>
        </div>
      </div>
      {/* <DuelGrid activeButton={activeButton} setActiveButton={setActiveButton} specialCategoryIndex={specialCategoryIndex} setSpecialCategoryIndex={setSpecialCategoryIndex} /> */}
   
      {/* <DuelFilter
        options={filterOptions}
        onOptionSelect={setActiveFilterIndex}
      /> */}
    </div>
  );
}
