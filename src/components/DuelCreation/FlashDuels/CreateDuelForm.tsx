import React from "react";
import CategorySelect from "./CategorySelect";
import BetInput from "./BetInput";
import BetIconUpload from "./BetIconUpload";
import DurationSelect from "./DurationSelect";
import InfoBox from "./InfoBox";
import SubmitButton from "./SubmitButton";
import { useWriteContract } from "wagmi";
import { CHAIN_ID, durations, NEXT_PUBLIC_API, NEXT_PUBLIC_FLASH_DUELS, NEXT_PUBLIC_FLASH_USDC, NEXT_PUBLIC_TIMER_BOT_URL } from "@/utils/consts";
import { FLASHUSDCABI } from "@/abi/FLASHUSDC";
import { waitForTransactionReceipt } from "wagmi/actions";
import { config } from "@/app/config/wagmi";
import { FLASHDUELSABI } from "@/abi/FlashDuels";
import { mapCategoryToEnumIndex, mapDurationToNumber } from "@/utils/helper";
import { getGasPrice } from '@wagmi/core'
import axios from "axios";
import { usePrivy } from "@privy-io/react-auth";
import { ethers } from "ethers";

const CreateDuelForm = () => {
  const provider = new ethers.JsonRpcProvider('https://evm-rpc-testnet.sei-apis.com/');
  async function fetchTransactionEvents(transactionHash: string) {
    try {
      const receipt = await provider!.getTransactionReceipt(transactionHash);
  
      if (!receipt) {
        console.error('Transaction receipt not found!');
        return;
      }
  
      const contract = new ethers.Contract(NEXT_PUBLIC_FLASH_DUELS, FLASHDUELSABI, provider);
  
      // Use a regular loop to allow early return
      for (const log of receipt.logs) {
        // Check if the log was emitted by your contract
        if (log.address.toLowerCase() === NEXT_PUBLIC_FLASH_DUELS.toLowerCase()) {
          try {
            // Parse the log using the ABI
            const parsedLog = contract.interface.parseLog(log);
            const targetArray = parsedLog!.args; // Access the target array
  
            const duelId = targetArray[1];
            const createTime = Number(targetArray[3]);
  
            // Return the values
            return { duelId, createTime };
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
  const { user } = usePrivy()
  const [formData, setFormData] = React.useState({
    category: "",
    betAmount: "",
    betIcon: "",
    duration: "3H",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | string
  ) => {
    if (typeof e === "string") {
      setFormData({
        ...formData,
        duration: e,
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const {
    writeContractAsync: lpTokenApproveAsyncLocal,
  } = useWriteContract({});

  const {
    writeContractAsync: lpTokenSecondFunctionAsyncLocal,
  } = useWriteContract({});

  // Function to approve the token
  const lpTokenApproveAsync = () =>
    lpTokenApproveAsyncLocal({
      abi: FLASHUSDCABI,
      address: NEXT_PUBLIC_FLASH_USDC as `0x${string}`,
      functionName: "increaseAllowance",
      chainId: CHAIN_ID,
      args: [NEXT_PUBLIC_FLASH_DUELS, 10 * 10 ** 6],
    });

  // Function to call the second contract function
  const lpTokenSecondFunctionAsync = (topic: string, category: number, duration: number, options: string[]) =>
    lpTokenSecondFunctionAsyncLocal({
      abi: FLASHDUELSABI,
      address: NEXT_PUBLIC_FLASH_DUELS as `0x${string}`,
      functionName: "createDuel",
      chainId: CHAIN_ID,
      args: [category, topic, options, 10 ** 6, duration],
    });


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const gasPrice = await getGasPrice(config)
    console.log("Form Data: ", formData);
    console.log("gasPrice", gasPrice)

    try {
      const hash = await lpTokenApproveAsync();
      const receipt = await waitForTransactionReceipt(config, { hash });

      // if (lpTokenApproveIsSuccess) {
      console.log("Approval successful: ", receipt);

      const categoryEnumIndex = mapCategoryToEnumIndex(formData.category);
      const durationNumber = mapDurationToNumber(formData.duration);
      const options = ["YES", "NO"];

      const secondHash = await lpTokenSecondFunctionAsync(formData.betAmount, categoryEnumIndex, durationNumber, options);
      const secondReceipt = await waitForTransactionReceipt(config, { hash: secondHash });

      // if (lpTokenSecondFunctionIsSuccess) {
      console.log("Second function successful: ", secondReceipt.logs[1].transactionHash);

      const result = await fetchTransactionEvents(secondReceipt.logs[1].transactionHash)

      if (!result) {
        console.error('Error fetching transaction events');
        return;
      }
      const duelData = {
        duelId: result.duelId ,
        type: "FLASH_DUEL",
        category: formData.category === "" ? "Any" : formData.category,
        betString: formData.betAmount,
        betIcon: formData.betIcon,
        endsIn: durations[durationNumber],
        createdAt: result.createTime,
      };
    // Send request to your backend
      const response = await axios.post(
        `${NEXT_PUBLIC_API}/duels/create`,
        {
          ...duelData,
          twitterUsername: user?.twitter?.username,
          address: user?.wallet?.address,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      console.log(response)

      await axios.post(`${NEXT_PUBLIC_TIMER_BOT_URL}/startDuel`, {
        duelId: result.duelId,
        duelType: 'FLASH_DUEL',
        duration: durations[durationNumber],
        startTime: result.createTime,
        category: categoryEnumIndex
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error("Error: ", error);
    }
  };


  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col justify-center py-2.5 rounded-lg  bg-zinc-900 max-w-[432px]"
    >
      <div className="flex flex-col self-center px-4 mt-4 w-full">
        <div className="flex gap-2 items-start px-28 py-3 w-full">
          <div className="flex flex-1 shrink bg-pink-300 rounded-md basis-0 h-[5px] w-[83px]" />
          <div className="flex flex-1 shrink bg-pink-300 rounded-md basis-0 h-[5px] w-[83px]" />
        </div>
        <CategorySelect name="category" value={formData.category} onChange={handleInputChange} />
        <BetInput name="betAmount" value={formData.betAmount} onChange={handleInputChange} />
        <BetIconUpload name="betIcon" value={formData.betIcon} onChange={handleInputChange} />
        <DurationSelect name="duration" value={formData.duration} onChange={handleInputChange} />

        <InfoBox />
        <SubmitButton />
      </div>
    </form>
  );
};

export default CreateDuelForm;
