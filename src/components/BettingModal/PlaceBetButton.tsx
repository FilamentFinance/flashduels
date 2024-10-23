import { FLASHDUELSABI } from "@/abi/FlashDuels";
import { FLASHUSDCABI } from "@/abi/FLASHUSDC";
import { config } from "@/app/config/wagmi";
import { CHAIN_ID, NEXT_PUBLIC_API, NEXT_PUBLIC_FLASH_DUELS, NEXT_PUBLIC_FLASH_USDC } from "@/utils/consts";
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
}

const PlaceBetButton: React.FC<PlaceBetButtonProps> = ({ betAmount, bet, duelId, duelType }) => {
  const { user } = usePrivy();
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

  const joinFlashDuel = (duelId: string, option: string, optionIndex: number, optionPrice: number, amount: number) =>
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
    const backendValue = 50 //ask shivam
    const optionPrice = backendValue * 10 ** 6;

    // if (lpTokenAp
    const secondHash = await joinFlashDuel(duelId, bet, optionIndex, optionPrice, amount);
    const secondReceipt = await waitForTransactionReceipt(config, { hash: secondHash });

    console.log(secondReceipt, "second-hash")


    console.log("Call BE", user?.twitter?.username, bet, duelId, duelType);

    await axios.post(
      `${NEXT_PUBLIC_API}/duels/create`,
      {
        twitterUsername: user?.twitter?.username,
        bet: bet,
        betAmount: betAmount,
        optionIndex: optionIndex,
        optionPrice: optionPrice,
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
