"use client";
import React, { useState } from "react";
// import Header from "./Header/Header";
// import DuelGrid from "./DuelGrid";
// import SearchBar from "./SearchBar";
import DuelGrid from "./DuelGrid";
// import DuelCategoryCard from "./DuelCategories/DuelCategoryCard";
import DuelCategories from "./DuelCategories/DuelCategories";

const MainContent: React.FC = () => {
  const [activeButton, setActiveButton] = useState<string>("liveDuels");

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

  return (
    <main className="flex overflow-hidden flex-col pb-56 max-md:pb-24">
      {/* <Header /> */}
      <DuelCategories />
      <div className="flex overflow-hidden px-[50px] justify-start font-bold p-1 my-[20px] h-full text-base text-center rounded-lg bg-white bg-opacity-0 min-w-[240px] text-stone-200">
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


      {/* <SearchBar /> */}
      <DuelGrid />
    </main>
  );
};

export default MainContent;
