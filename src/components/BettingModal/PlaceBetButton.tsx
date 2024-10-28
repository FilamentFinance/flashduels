import { FLASHUSDCABI } from "@/abi/FLASHUSDC";
import { FLASHDUELSABI } from "@/abi/FlashDuelsABI";
import { config } from "@/app/config/wagmi";
import { postPricingData, useTotalBets } from "@/app/optionPricing";
import { CHAIN_ID, NEXT_PUBLIC_API, NEXT_PUBLIC_FLASH_DUELS, NEXT_PUBLIC_FLASH_USDC } from "@/utils/consts";
// import { getCryptoPrices } from "@/utils/prices";
import { usePrivy } from "@privy-io/react-auth";
import axios from "axios";
import React from "react";
import { useWriteContract } from "wagmi";
import { waitForTransactionReceipt } from "wagmi/actions";

interface PlaceBetButtonProps {
  betAmount: string;
  bet: string
  duelId: string;
  duelType: string;
  asset?: string;
  triggerPrice?: string;
  endsIn?: number;
  markPrice:number
}

const PlaceBetButton: React.FC<PlaceBetButtonProps> = ({ betAmount, bet, duelId, duelType, asset, triggerPrice, endsIn, markPrice }) => {
  const { user } = usePrivy();
  
  const { totalBetYes, totalBetNo } = useTotalBets(duelId);
  console.log(endsIn, asset, triggerPrice, totalBetNo, totalBetYes ,"hello")
  const {
    writeContractAsync: lpTokenApproveAsyncLocal,
  } = useWriteContract({});

  const {
    writeContractAsync: lpTokenSecondFunctionAsyncLocal,
  } = useWriteContract({});


  const lpTokenApproveAsync = (amount: number) =>
    lpTokenApproveAsyncLocal({
      abi: FLASHUSDCABI,
      address: NEXT_PUBLIC_FLASH_USDC as `0x${string}`,
      functionName: "increaseAllowance",
      chainId: CHAIN_ID,
      args: [NEXT_PUBLIC_FLASH_DUELS, amount],
    });

  const joinCryptoDuel = async (duelId: string, option: string, asset: string, optionIndex: number, optionPrice: number, amount: number) => {
    return lpTokenSecondFunctionAsyncLocal({
      abi: FLASHDUELSABI,
      address: NEXT_PUBLIC_FLASH_DUELS as `0x${string}`,
      functionName: "joinCryptoDuel",
      chainId: CHAIN_ID,
      args: [duelId, option, asset, optionIndex, optionPrice, amount],
    });
  }
  const joinFlashDuel = async (duelId: string, option: string, optionIndex: number, optionPrice: number, amount: number) =>
    lpTokenSecondFunctionAsyncLocal({
      abi: FLASHDUELSABI,
      address: NEXT_PUBLIC_FLASH_DUELS as `0x${string}`,
      functionName: "joinDuel",
      chainId: CHAIN_ID,
      args: [duelId, option, optionIndex, optionPrice, amount],
    });
  const handleClick = async () => {
    const amount = Number(betAmount) * 10 ** 6;
    const hash = await lpTokenApproveAsync(amount);
    const receipt = await waitForTransactionReceipt(config, { hash });

    console.log(receipt, "approve-hash")

    const optionIndex = bet === "YES" ? 0 : 1;
    const timePeriod = endsIn && endsIn / (365 * 24)
    // const markPrice = await getCryptoPrices(asset as string)

    let secondHash;
    let backendValue;

    if (duelType === "COIN_DUEL" && asset) {
      backendValue = await postPricingData(markPrice, Number(triggerPrice), (asset as string), timePeriod as number, totalBetYes || 0, totalBetNo || 0)
      const indexValue = bet === "YES" ? backendValue["Yes Price"] : backendValue["No Price"];
      const optionPrice = indexValue * 10 ** 6;
      console.log(duelId, bet, asset, optionIndex, optionPrice, amount, "hello-duel");
      secondHash = await joinCryptoDuel(duelId, bet, asset, optionIndex, optionPrice, amount);
      console.log(secondHash, "second-hash")

    } else {
      backendValue = 50;
      const optionPrice = backendValue * 10 ** 6;
      secondHash = await joinFlashDuel(duelId, bet, optionIndex, optionPrice, amount);
      console.log(secondHash, "second-hash-flash")

    }

    const secondReceipt = await waitForTransactionReceipt(config, { hash: secondHash as `0x${string}` });

    console.log(secondReceipt, "second-hash")


    console.log("Call BE", user?.twitter?.username, bet, betAmount, duelId, duelType, optionIndex, backendValue);

    await axios.post(
      `${NEXT_PUBLIC_API}/bets/create`,
      {
        twitterUsername: user?.twitter?.username,
        bet: bet,
        address: user?.wallet?.address,
        betAmount: betAmount,
        optionIndex: optionIndex,
        optionPrice: backendValue.toString(),
        duelId: duelId,
        duelType: duelType
      },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
  }

  return (
    <button
      className="flex flex-col mt-4 w-full text-base font-semibold leading-none text-gray-900"
      disabled={!betAmount}
      onClick={handleClick}
    >
      <div className="gap-2.5 self-stretch px-3 py-2.5 w-full rounded shadow-sm bg-[linear-gradient(180deg,#F19ED2_0%,#C87ECA_100%)]">
        Place Bet
      </div>
    </button>
  );
};

export default PlaceBetButton;
