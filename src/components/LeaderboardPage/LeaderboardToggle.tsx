"use client"
export default function ToggleButtons({ activeButton, setActiveButton}: { activeButton: string, setActiveButton: (button: string) => void }) {

  const handleButtonClick = (button: string) => {
    setActiveButton(button);
  };

  return (
    <div className="flex overflow-hidden justify-center self-center p-1 text-base rounded-lg border border-solid bg-white bg-opacity-0 border-white border-opacity-10 min-h-[50px]">
      
      {/* Creators Button */}
      <button
        className={`flex relative gap-4 items-start px-4 py-3 h-full leading-none text-white rounded-lg w-[195px] ${
          activeButton === 'creators'
            ? 'bg-[linear-gradient(180deg,#F19ED2_0%,#C87ECA_100%)]'
            : 'bg-transparent text-stone-200'
        }`}
        onClick={() => handleButtonClick('creators')}
      >
        <div className="flex absolute inset-0 z-0 shrink-0 items-center self-start rounded-lg border-solid shadow-sm border-[0.5px] border-black border-opacity-0 h-[42px] w-[195px]" />
        <span className="z-0 my-auto text-ellipsis w-[163px]">Creators</span>
      </button>

      {/* Traders Button */}
      <button
        className={`flex relative gap-4 items-start px-4 py-3 h-full leading-none text-white rounded-lg w-[195px] ${
          activeButton === 'traders'
            ? 'bg-[linear-gradient(180deg,#F19ED2_0%,#C87ECA_100%)] text-white'
            : 'bg-transparent text-stone-200'
        }`}
        onClick={() => handleButtonClick('traders')}
      >
         <div className="flex absolute inset-0 z-0 shrink-0 items-center self-start rounded-lg border-solid shadow-sm border-[0.5px] border-black border-opacity-0 h-[42px] w-[195px]" />
         <span className="z-0 my-auto text-ellipsis w-[163px]">Traders</span>
      </button>
    </div>
  );
}
