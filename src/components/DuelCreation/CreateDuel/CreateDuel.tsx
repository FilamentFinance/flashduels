import React from "react";
import PriceInput from "./PriceInput";
import WinConditionSelect from "./WinConditionSelect";
import DurationSelect from "./DurationSelect";
import InfoBox from "./InfoBox";
import CreateDuelButton from "./CreateDuelButton";
import TokenSelect from "./TokenInput";
import { CHAIN_ID, durations, NEXT_PUBLIC_API, NEXT_PUBLIC_FLASH_DUELS, NEXT_PUBLIC_FLASH_USDC, NEXT_PUBLIC_RPC_URL, NEXT_PUBLIC_TIMER_BOT_URL } from "@/utils/consts";
import { mapDurationToNumber } from "@/utils/helper";
import { FLASHUSDCABI } from "@/abi/FLASHUSDC";
import { FLASHDUELSABI } from "@/abi/FlashDuelsABI";
import { useWriteContract } from "wagmi";
import { waitForTransactionReceipt } from "wagmi/actions";
import { config } from "@/app/config/wagmi";
import axios from "axios";
import { usePrivy } from "@privy-io/react-auth";
import { ethers } from "ethers";
import MarkPriceComponent from "./MarkPrice";

interface FormData {
  tokenInput: string;
  triggerPrice: string;
  minWager: string;
  winCondition: string;
  durationSelect: string;
}

const CreateDuel: React.FC = () => {

  const provider = new ethers.JsonRpcProvider(NEXT_PUBLIC_RPC_URL);
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

            const duelId = targetArray[2];
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

  const [formData, setFormData] = React.useState<FormData>({
    tokenInput: "BTC",
    triggerPrice: "",
    minWager: "",
    winCondition: "ABOVE",
    durationSelect: "3H", // Set a default value if necessary
  });

 const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | string
  ) => {
    // Check if the input is a string (for custom components like DurationSelect)
    if (typeof e === "string") {
      setFormData((prev) => ({
        ...prev,
        durationSelect: e, // Update the specific form field for durationSelect
      }));
    } else {
      // Handle typical input change
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value, // Dynamically set the form data
      }));
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
      args: [NEXT_PUBLIC_FLASH_DUELS, 5 * 10 ** 6],
    });

  // Function to call the second contract function
  const lpTokenSecondFunctionAsync = (symbol: string, options: string[], minWager: number, triggerValue: number, triggerType: number, triggerCondition: number, duration: number) =>

    lpTokenSecondFunctionAsyncLocal({
      abi: FLASHDUELSABI,
      address: NEXT_PUBLIC_FLASH_DUELS as `0x${string}`,
      functionName: "createCryptoDuel",
      chainId: CHAIN_ID,
      args: [symbol, options, triggerValue, triggerType, triggerCondition, duration],
    });


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form Data new: ", formData);
    try {
      const hash = await lpTokenApproveAsync();
      const receipt = await waitForTransactionReceipt(config, { hash });

      // if (lpTokenApproveIsSuccess) {
      console.log("Approval successful: ", receipt);

      // const categoryEnum = mapCategoryToEnum(formData.category);
      const durationNumber = mapDurationToNumber(formData.durationSelect);
      const triggerPrice = Number(formData.triggerPrice) * 10 ** 8;
      const minWager = Number(formData.minWager) * 10 ** 6;
      const options = ["YES", "NO"];
      const triggerType = 0;
      const symbol = formData.tokenInput;
      const winCondition = formData.winCondition === "ABOVE" ? 0 : 1;
      const markPrice = "66000";

      const secondHash = await lpTokenSecondFunctionAsync(symbol, options, minWager, triggerPrice, triggerType, winCondition, durationNumber);
      const secondReceipt = await waitForTransactionReceipt(config, { hash: secondHash });

      const result = await fetchTransactionEvents(secondReceipt.logs[1].transactionHash)

      if (!result) {
        console.error('Error fetching transaction events');
        return;
      }
      console.log("Second function successful: ", secondReceipt, secondReceipt.logs[1].transactionHash);

      const duelData = {
        duelId: result.duelId,
        type: "COIN_DUEL",
        token: symbol,
        markPrice: markPrice,
        triggerPrice: formData.triggerPrice,
        minimumWager: formData.minWager,
        winCondition: winCondition,
        endsIn: durations[durationNumber],
        createdAt: result.createTime,
      };


      console.log(duelData, "duelData")
  
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
      // const durationHour = durationNumber === 0 ? 3 : durationNumber === 1 ? 6 : durationNumber ===2 ?12 : 0
      // timer bot call
      await axios.post(`${NEXT_PUBLIC_TIMER_BOT_URL}/startDuel`, {
        duelId: result.duelId,
        duelType: 'COIN_DUEL',
        duration: durations[durationNumber],
        startTime: result.createTime,
        asset: symbol,
        category:1
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
    <form onSubmit={handleSubmit} className="flex flex-col justify-center py-2.5 rounded-lg bg-zinc-900 max-w-[432px]">
      <main className="flex flex-col items-center self-center px-4 mt-4 w-full">
        <div className="flex gap-2 items-start px-28 py-3 max-w-full w-[400px]">
          <div className="flex flex-1 shrink bg-pink-300 rounded-md basis-0 h-[5px] w-[83px]" />
          <div className="flex flex-1 shrink bg-pink-300 rounded-md basis-0 h-[5px] w-[83px]" />
        </div>
        <div className="flex flex-col mt-2 w-full max-w-[400px]">
          <TokenSelect name="tokenInput" value={formData.tokenInput} onChange={handleInputChange} />
          {/* <div className="flex flex-col mt-4 w-full text-base tracking-normal leading-none">
            <div className="flex flex-1 gap-1 items-center self-stretch my-auto text-base tracking-normal leading-none basis-0 justify-between">
              <div className="flex-1 shrink gap-1 self-stretch tracking-tighter my-auto text-gray-400">
                Mark Price
              </div>
              <div className="flex-1 shrink gap-1 self-stretch my-auto text-white whitespace-nowrap text-right">
                --
              </div>
            </div>
          </div> */}
          <MarkPriceComponent asset={formData.tokenInput}/>
          <PriceInput
            name="triggerPrice"
            value={formData.triggerPrice}
            onChange={handleInputChange}
            label="Trigger Price*"
            placeholder="Enter Trigger Price"
          />
          {/* <PriceInput
            name="minWager"
            value={formData.minWager}
            onChange={handleInputChange}
            label="Minimum Wager Amount*"
            placeholder="Enter Minimum Bet Price"
          /> */}
          <WinConditionSelect name="winCondition" value={formData.winCondition} onChange={handleInputChange} />
          <DurationSelect name="durationSelect" value={formData.durationSelect} onChange={handleInputChange} />
          <p className="self-start mt-4 text-xs font-medium tracking-normal leading-none text-center text-white">
            YES wins if mark price is <span className="underline">above</span>{" "}
            <span className="underline">[trigger price]</span> after{" "}
            <span className="underline">3 Hours</span>
          </p>
        </div>
        <InfoBox />
        <CreateDuelButton />
      </main>
    </form>
  );
};

export default CreateDuel;
