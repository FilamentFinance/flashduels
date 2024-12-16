import * as React from "react";
import { WalletBalanceProps } from "./types";

export const WalletBalance: React.FC<WalletBalanceProps> = ({
  amount,
  currency,
  onClaim,
  onDeposit,
}) => {
  return (
    <div className="flex gap-2 items-center self-stretch py-1 pr-1 pl-2 my-auto whitespace-nowrap rounded-lg border-2 border-solid bg-white bg-opacity-0 border-white border-opacity-10 shadow-[0px_2px_10px_rgba(0,0,0,0.25)]">
      <div className="flex gap-1 justify-center items-center self-stretch my-auto text-base text-stone-200">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/4bd09ea4570a4d12834637c604f75b6a/427d45b45afa37b1eb87be276dafef70bc14ecf23817ee21e7de77d5a21bc791?apiKey=0079b6be27434c51a81de1c6567570a7&"
          className="object-contain shrink-0 self-stretch my-auto aspect-square w-[18px]"
          alt={`${currency} icon`}
        />
        <div className="self-stretch my-auto">{amount}</div>
      </div>
      {onClaim && (
        <button
          onClick={onClaim}
          className="gap-2.5 self-stretch px-3 py-2.5 my-auto text-base font-semibold leading-none text-gray-900 rounded border-2 border-solid shadow-sm bg-[linear-gradient(180deg,#F19ED2_0%,#C87ECA_100%)] border-white border-opacity-70"
          aria-label={`Claim ${amount} ${currency}`}
        >
          Claim
        </button>
      )}
      {onDeposit && (
        <button
          onClick={onDeposit}
          className="gap-2.5 self-stretch px-3 py-2.5 my-auto text-base font-semibold leading-none text-gray-900 rounded border-2 border-solid shadow-sm bg-[linear-gradient(180deg,#F19ED2_0%,#C87ECA_100%)] border-white border-opacity-70"
          aria-label={`Deposit ${amount} ${currency}`}
        >
          Deposit
        </button>
      )}
    </div>
  );
};
