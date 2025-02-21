import { useBalance } from "@/blockchain/useBalance";
import React, { useState } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { GeneralNotificationAtom } from "../GeneralNotification";
import { useAtom } from "jotai";
import { estConnection } from "@/utils/atoms";
import usePopup from "@/app/providers/PopupProvider";
import { apiClient } from "@/utils/apiClient";
import { CHAIN_ID, NEXT_PUBLIC_API, NEXT_PUBLIC_DIAMOND, NEXT_PUBLIC_RPC_URL } from "@/utils/consts";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { OPTION_TOKEN_ABI } from "@/abi/OptionToken";
import { FLASHDUELS_VIEWFACET } from "@/abi/FlashDuelsViewFacet";
import { FLASHDUELS_MARKETPLACE } from "@/abi/FlashDuelsMarketplaceFacet";
// import { FLASHUSDCABI } from "@/abi/FLASHUSDC";
import { waitForTransactionReceipt } from "@wagmi/core";
import Decimal from 'decimal.js';
import { config } from "@/app/config/wagmi";
import { ethers } from "ethers";
import useSwitchNetwork from "@/blockchain/useSwitchNetwork";
import { multiplyBy10Power } from "@/utils/helper";
// import { FLASHUSDCABI } from "@/abi/FLASHUSDC";

interface SellButtonProps {
  quantity: string;
  price: string;
  betOptionId: string;
  optionIndex: number;
  duelId: string;
  //   setIsModalOpen: (arg0: boolean) => void;
}

const SellButton: React.FC<SellButtonProps> = ({
  quantity, price, betOptionId, optionIndex, duelId
}) => {
  console.log(quantity, "quantity")
  const { address, isConnected, chainId } = useAccount();
  const [establishConnection] = useAtom(estConnection)
  const { showPopup } = usePopup()
  const [notification, setNotification] = useAtom(GeneralNotificationAtom);
  const { refetch } = useBalance(address as string);
  //   const { totalBetYes, totalBetNo } = useTotalBets(duelId);
  const [loading, setLoading] = useState(false); // Add loading state
  console.log(notification)
  const {handleNetworkChange} = useSwitchNetwork()
  const {
    writeContractAsync: lpTokenApproveAsyncLocal,
  } = useWriteContract({});
  const {
    writeContractAsync: lpTokenSecondFunctionAsyncLocal,
  } = useWriteContract({});

  const {
    data: optionTokenAddress,
  } = useReadContract({
    abi: FLASHDUELS_VIEWFACET,
    functionName: "getOptionIndexToOptionToken",
    address: NEXT_PUBLIC_DIAMOND as `0x${string}`,
    chainId: CHAIN_ID,
    args: [duelId, optionIndex],
  });

  const provider = new ethers.JsonRpcProvider(NEXT_PUBLIC_RPC_URL);
  async function fetchTransactionEvents(transactionHash: string) {
    try {
      const receipt = await provider!.getTransactionReceipt(transactionHash);

      if (!receipt) {
        console.error('Transaction receipt not found!');
        return;
      }

      const contract = new ethers.Contract(NEXT_PUBLIC_DIAMOND, FLASHDUELS_MARKETPLACE, provider);

      // Use a regular loop to allow early return
      for (const log of receipt.logs) {
        // Check if the log was emitted by your contract
        if (log.address.toLowerCase() === NEXT_PUBLIC_DIAMOND.toLowerCase()) {
          try {
            // Parse the log using the ABI
            const parsedLog = contract.interface.parseLog(log);
            const targetArray = parsedLog!.args; // Access the target array

            console.log(targetArray, "targetArray", parsedLog, "parsedLog")

            const sellId = targetArray[0];
            const amount = targetArray[4];

            const finalAmount = Number(ethers.formatUnits(amount, 6));
            // Return the values
            return { sellId, amount: finalAmount };
          } catch (error) {
            console.error('Error parsing log:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching transaction receipt:', error);
    }

    // Return undefined if no logs are found
    return;
  }

  const lpTokenApproveAsync = async () => {
    const finalQuantity = multiplyBy10Power(quantity, 18) 

    return await lpTokenApproveAsyncLocal({
      abi: OPTION_TOKEN_ABI,
      address: optionTokenAddress as `0x${string}`,
      functionName: "approve",
      chainId: CHAIN_ID,
      args: [NEXT_PUBLIC_DIAMOND, finalQuantity],
    });
  }


  const sellBet = async () => {
    const priceFinal = new Decimal(price);
    const quantityFinal = new Decimal(quantity);
    console.log(priceFinal, quantityFinal, "priceFinal, quantityFinal")
    const result = ((priceFinal.times(quantityFinal)).times(10 ** 6)).toFixed(0)
    const finalQuantity = multiplyBy10Power(quantity, 18) 

    return lpTokenSecondFunctionAsyncLocal({
      abi: FLASHDUELS_MARKETPLACE,
      address: NEXT_PUBLIC_DIAMOND as `0x${string}`,
      functionName: "sell",
      chainId: CHAIN_ID,
      args: [optionTokenAddress, duelId, optionIndex, finalQuantity, result ],
    });
  };

  const handleClick = async () => {
    setLoading(true); // Start loading

    try {

      const hash = await lpTokenApproveAsync();
      await waitForTransactionReceipt(config, { hash });

      const sellHash = await sellBet()
      const sellReciept = await waitForTransactionReceipt(config, { hash: sellHash });
      console.log(sellHash, "hash-2-success", sellReciept)
      const result = await fetchTransactionEvents(sellReciept.logs[0].transactionHash)
      console.log(result, "result")


      console.log(betOptionId, quantity, price, parseFloat(quantity), "betOptionId, quantity, price")

      await apiClient.post(
        `${NEXT_PUBLIC_API}/user/betOption/sell`,
        {
          betOptionId,
          quantity: quantity,
          price: price,
          duelId,
          amount: result?.amount,
          sellId: Number(result?.sellId)
        },
        {
          headers: {
            "Content-Type": "application/json",
          }
        }
      );
      setNotification({
        isOpen: true,
        success: true,
        massage: "Placed Sell Order Successfully",
      });
    } catch (error) {
      setNotification({
        isOpen: true,
        success: false,
        massage: "Failed to Place Sell Order",
      });
      console.error("Error placing bet:", error);
    } finally {
      setLoading(false); // Stop loading
      //   setIsModalOpen(false);
      refetch()
    }
  };

  return (
    <div>
      {!isConnected ? 
      <ConnectButton />
       : establishConnection ? 
       <button
        className="gap-2.5 self-stretch px-3 py-2.5 w-full rounded shadow-sm bg-[linear-gradient(180deg,#F19ED2_0%,#C87ECA_100%)]"
        onClick={showPopup}
      >
        Enable Trading
      </button> :
       chainId !== CHAIN_ID ? ( // Check if the user is on the correct network
        <button
        className="gap-2.5 self-stretch px-3 py-2.5 w-full rounded shadow-sm bg-[linear-gradient(180deg,#F19ED2_0%,#C87ECA_100%)]"
        onClick={handleNetworkChange}
      >
        Switch Network
      </button>
      ) :
        <button
          className="flex flex-col mt-4 w-full text-base font-semibold leading-none text-gray-900"
          //   disabled={!betAmount}
          onClick={handleClick}
        >
          <div className="gap-2.5 self-stretch px-3 py-2.5 w-full rounded shadow-sm bg-[linear-gradient(180deg,#F19ED2_0%,#C87ECA_100%)]">
            {loading ? (
              <div className="spinner"></div>  // Add the spinner here
            ) : (
              <span>Sell Bet</span>
            )}
          </div>
        </button>}
    </div>

  );
};

export default SellButton;
