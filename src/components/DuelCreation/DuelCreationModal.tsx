import React, { useState } from "react";
import ProgressBar from "./ProgressBar";
import MarketOption from "./MarketOption";
import CreateDuel from "./CreateDuel/CreateDuel";
import CreateDuelForm from "./FlashDuels/CreateDuelForm";

interface DuelCreationModalProps {
  onClose: () => void;
}

const DuelCreationModal: React.FC<DuelCreationModalProps> = ({ onClose }) => {
  const [selectedMarket, setSelectedMarket] = useState<string | null>(null);
  const [isDuelSelected, setIsDuelSelected] = useState(false); // New state for duel selection

  const marketOptions = [
    {
      title: "Coin Duel",
      description:
        "Create Battles Based on Token Prices, resolved by Oracle price from Pyth",
      imageSrc:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/8d2d7564e5bab940df0631914b992a58dac21a8ec255a76fddb1fa36549b1049?placeholderIfAbsent=true&apiKey=5395477fd4e141368e15c98db5e38353",
    },
    {
      title: "Flash Duel",
      description:
        "Create Duel Based on Sports, News, pop Culture, bets are settled by Flash Duels",
      imageSrc:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/1705e0579c11f5aa986b96f0f79cd302a2a86866ef138ed205a434828357f3d1?placeholderIfAbsent=true&apiKey=5395477fd4e141368e15c98db5e38353",
    },
  ];

  const handleMarketSelect = (title: string) => {
    setSelectedMarket(title);
  };

  const handleNext = () => {
    setIsDuelSelected(true); // Set duel selected state to true
  };

  const closeDuelModal = () => {
    setIsDuelSelected(false); // Reset duel selected state
    setSelectedMarket(null); // Reset the selected market
    onClose(); // Close the modal
  };
  

  return (
    <>
      <section className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="flex flex-col justify-center py-2.5 rounded-lg border border-solid bg-zinc-900 border-white border-opacity-10 max-w-[432px]">
          <header className="flex relative gap-2.5 justify-center items-start py-2 w-full text-xl font-semibold text-center text-white border-b border-zinc-700">
            <h1 className="z-0 flex-1 shrink my-auto w-full basis-0">
              Create a Duel
            </h1>
            <button
              onClick={closeDuelModal}
              aria-label="Close modal"
              className="object-contain absolute top-0.5 right-3 z-0 shrink-0 self-start w-7 h-7 aspect-square fill-white fill-opacity-10 stroke-[1px] stroke-white stroke-opacity-0"
            >
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/377c89fd567cf680be5066da45d9d19657aa33784fa3fd3e884e8beec65bc5cd?placeholderIfAbsent=true&apiKey=5395477fd4e141368e15c98db5e38353"
                alt=""
                className="w-full h-full"
              />
            </button>
          </header>
          {isDuelSelected ? ( // Conditional rendering based on duel selection
            selectedMarket === "Coin Duel" ? <CreateDuel closeDuelModal={closeDuelModal} /> : <CreateDuelForm closeDuelModal={closeDuelModal}/>
          ) : (
            <div className="flex flex-col self-center mt-4 w-full">
              <ProgressBar />
              <div className="flex flex-col px-4 mt-6 w-full">
                <div className="flex flex-col w-full">
                  <label
                    htmlFor="marketSelect"
                    className="flex flex-col w-full text-base leading-none text-gray-400"
                  >
                    <span className="flex gap-1 items-center w-full">
                      <span className="gap-1 self-stretch my-auto min-w-[240px] w-[284px]">
                        Choose a market
                      </span>
                    </span>
                  </label>
                  <div className="mt-2 w-full max-w-[407px]">
                    <div className="flex gap-5 max-md:flex-col">
                      {marketOptions.map((option, index) => (
                        <MarketOption
                          key={index}
                          title={option.title}
                          description={option.description}
                          imageSrc={option.imageSrc}
                          isSelected={selectedMarket === option.title}
                          onSelect={() => handleMarketSelect(option.title)}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleNext}
                  disabled={!selectedMarket}
                  className="gap-2.5 self-stretch px-3 py-2.5 mt-6 w-full text-base font-semibold leading-none text-gray-900 whitespace-nowrap rounded shadow-sm bg-[linear-gradient(180deg,#F19ED2_0%,#C87ECA_100%)] border-white border-opacity-70 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default DuelCreationModal;
