import React from "react";

interface BetAmountProps {
  availableAmount: number;
  betAmount: string;
  setBetAmount: (value: string) => void;
  noPrice?: number;
  yesPrice?: number;
  text: string;
  showAvailable: boolean;
  showUSDC: boolean
}

const BetAmount: React.FC<BetAmountProps> = ({ availableAmount, betAmount, setBetAmount, text, showUSDC, showAvailable }) => {

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setBetAmount(value);
  };

  const handleMaxClick = () => {
    setBetAmount(availableAmount.toString());
  };

  return (
    <section className="flex flex-col justify-center mt-4 w-full">
      <div className="flex w-full text-base tracking-normal leading-none justify-between">
        <label
          htmlFor="betAmount"
          className="gap-1 self-stretch my-auto text-gray-400 whitespace-nowrap min-w-[240px] w-[284px]"
        >
          {text}
        </label>

        {showAvailable && (
          <div className="flex h-full gap-x-1 text-gray-400">
            <span className="self-stretch my-auto w-[68px]">Available:{" "}</span>
            <span className="self-stretch my-auto">{availableAmount}</span>
            <button
              onClick={handleMaxClick}
              className="flex gap-2 items-center text-xs font-medium text-orange-400 whitespace-nowrap"
            >
              <span className="overflow-hidden py-1 rounded">Max</span>
            </button>
          </div>
        )}
      </div>

      <div className="flex overflow-hidden mt-1 w-full rounded-lg shadow-sm bg-neutral-800">
        <div className="flex flex-1 shrink items-center my-auto basis-8 min-w-[240px]">
          <div className="flex flex-1 shrink gap-2.5 items-start self-stretch px-4 py-2 my-auto w-full basis-0 min-w-[240px]">
            <div className="flex flex-col flex-1 shrink w-full basis-0 min-w-[240px]">
              <input
                type="text"
                id="betAmount"
                value={`${!showUSDC ? `$${betAmount}` : betAmount}`}
                onChange={handleAmountChange}
                aria-label="Duel amount"
                className="text-xl font-medium tracking-normal leading-none text-stone-200 bg-transparent border-none"
              />

            </div>
          </div>
        </div>
        <div className="flex shrink-0 w-px bg-zinc-800 h-[65px]" />
        {showUSDC && <div className="flex gap-2.5 items-center py-3.5 pr-5 pl-3 h-full text-xl font-medium tracking-normal text-center whitespace-nowrap text-stone-200">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 24C18.65 24 24 18.65 24 12C24 5.34996 18.65 0 12 0C5.34996 0 0 5.34996 0 12C0 18.65 5.34996 24 12 24Z" fill="#2775CA" />
            <path d="M15.3 13.9C15.3 12.15 14.25 11.55 12.15 11.3C10.65 11.1 10.35 10.7 10.35 9.99996C10.35 9.29988 10.85 8.85 11.85 8.85C12.75 8.85 13.25 9.15 13.5 9.9C13.55 10.05 13.7 10.15 13.85 10.15H14.65C14.85 10.15 15 9.99996 15 9.80004V9.75C14.8 8.64996 13.9 7.8 12.75 7.70004V6.50004C12.75 6.3 12.6 6.15 12.35 6.09996H11.6C11.4 6.09996 11.25 6.24996 11.2 6.50004V7.65C9.69996 7.85004 8.75004 8.85 8.75004 10.1C8.75004 11.75 9.75 12.4 11.85 12.65C13.25 12.9 13.7 13.2 13.7 14C13.7 14.8001 13 15.35 12.05 15.35C10.75 15.35 10.3 14.8 10.15 14.05C10.1 13.85 9.95004 13.75 9.80004 13.75H8.94996C8.75004 13.75 8.60004 13.9 8.60004 14.1V14.15C8.79996 15.4 9.6 16.3 11.25 16.55V17.75C11.25 17.95 11.4 18.1 11.65 18.15H12.4C12.6 18.15 12.75 18 12.8 17.75V16.55C14.3 16.3 15.3 15.25 15.3 13.9Z" fill="white" />
            <path fill-rule="evenodd" clip-rule="evenodd" d="M5.00004 9.54996C3.54996 13.4 5.55 17.75 9.45 19.15C9.6 19.25 9.75 19.45 9.75 19.6V20.3C9.75 20.4 9.75 20.45 9.69996 20.5C9.65004 20.7 9.45 20.8 9.24996 20.7C6.45 19.8 4.29996 17.65 3.39996 14.85C1.89996 10.1 4.5 5.04996 9.24996 3.54996C9.3 3.50004 9.39996 3.50004 9.45 3.50004C9.65004 3.54996 9.75 3.69996 9.75 3.9V4.59996C9.75 4.85004 9.65004 5.00004 9.45 5.1C7.40004 5.85 5.75004 7.44996 5.00004 9.54996ZM14.3 3.75C14.35 3.54996 14.55 3.45 14.75 3.54996C17.5 4.44996 19.7 6.6 20.6 9.45C22.1 14.2 19.5 19.25 14.75 20.75C14.7 20.8 14.6 20.8 14.55 20.8C14.35 20.75 14.25 20.6 14.25 20.4V19.7C14.25 19.45 14.35 19.3 14.55 19.2C16.6 18.45 18.25 16.85 19 14.75C20.45 10.9 18.45 6.54996 14.55 5.15004C14.4 5.04996 14.25 4.85004 14.25 4.65V3.95004C14.25 3.84996 14.25 3.80004 14.3 3.75Z" fill="white" />
          </svg>

          <span className="self-stretch my-auto">USDC</span>
        </div>}
      </div>
    </section>
  );
};

export default BetAmount;
