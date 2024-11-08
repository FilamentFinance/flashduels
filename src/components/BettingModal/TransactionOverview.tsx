import React from "react";

const TransactionOverview = ({betAmount}: {betAmount:string}) => {
  return (
    <section className="flex flex-col mt-4 w-full text-sm tracking-normal leading-none text-gray-400">
      <h3 className="flex justify-between items-center w-full max-w-[589px]">
        <span className="flex-1 shrink gap-1 self-stretch my-auto w-full min-w-[240px]">
          Transaction Overview
        </span>
      </h3>
      <div className="flex gap-3 items-start p-2 mt-1 w-full rounded border border-solid border-zinc-800">
        <div className="flex flex-col flex-1 shrink justify-center w-full basis-0 min-w-[240px]">
          <div className="flex gap-10 justify-between items-center w-full">
            <span className="flex flex-col items-start self-stretch my-auto w-[91px]">
              Your Bet
            </span>
            <span className="flex flex-col self-stretch my-auto whitespace-nowrap">
              ${betAmount}
            </span>
          </div>
          <div className="flex gap-6 justify-between items-center mt-1 w-full">
            <div className="flex gap-1 items-center self-stretch my-auto min-w-[240px] w-[326px]">
              <span className="flex flex-col self-stretch my-auto w-[91px]">
                Platform fees
              </span>
              <img
                src="http://b.io/ext_11-"
                alt=""
                className="object-contain shrink-0 self-stretch my-auto w-4 aspect-square"
              />
            </div>
            <span className="flex flex-col self-stretch my-auto whitespace-nowrap">
              5 USDC
            </span>
          </div>
          {/* <div className="flex gap-10 justify-between items-center mt-1 w-full">
            <span className="flex flex-col items-start self-stretch my-auto w-[91px]">
              Est. Gas
            </span>
            <span className="flex flex-col self-stretch my-auto whitespace-nowrap">
              $0.01
            </span>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default TransactionOverview;
