import React from "react";
import CategorySelect from "./CategorySelect";
import BetInput from "./BetInput";
import BetIconUpload from "./BetIconUpload";
import DurationSelect from "./DurationSelect";
import InfoBox from "./InfoBox";
import SubmitButton from "./SubmitButton";
import { useWatchContractEvent, useWriteContract } from "wagmi";
import { CHAIN_ID, durations, NEXT_PUBLIC_API, NEXT_PUBLIC_FLASH_DUELS, NEXT_PUBLIC_FLASH_USDC, NEXT_PUBLIC_TIMER_BOT_URL } from "@/utils/consts";
import { FLASHUSDCABI } from "@/abi/FLASHUSDC";
import { waitForTransactionReceipt } from "wagmi/actions";
import { config } from "@/app/config/wagmi";
import { FLASHDUELSABI } from "@/abi/FlashDuels";
import { mapCategoryToEnumIndex, mapDurationToNumber } from "@/utils/helper";
import { getGasPrice } from '@wagmi/core'
import axios from "axios";
import { usePrivy } from "@privy-io/react-auth";
import { v4 as uuidv4 } from 'uuid';
// import { useWallets } from "@privy-io/react-auth";

const CreateDuelForm = () => {
  const [formData, setFormData] = React.useState({
    category: "",
    betAmount: "",
    betIcon: "",
    duration: "",
  });

  const { user } = usePrivy();

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

    useWatchContractEvent({
      address: NEXT_PUBLIC_FLASH_DUELS as `0x${string}`,
      abi: FLASHDUELSABI,
      chainId: CHAIN_ID,
      eventName: 'DuelCreated',
      onLogs(logs) {
        console.log('New logs!', logs)
      },
      onError(error) {
        console.log('Error-new', error)
      }
    })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const gasPrice = await getGasPrice(config)
    console.log("Form Data: ", formData);
    console.log("hello", gasPrice)

    try {
      const hash = await lpTokenApproveAsync();
      const receipt = await waitForTransactionReceipt(config, { hash });

      // if (lpTokenApproveIsSuccess) {
      console.log("Approval successful: ", receipt);

      const categoryEnum = mapCategoryToEnumIndex(formData.category);
      const durationNumber = mapDurationToNumber(formData.duration);
      const options = ["YES", "NO"];

      const secondHash = await lpTokenSecondFunctionAsync(formData.betAmount, categoryEnum, durationNumber, options);
      const secondReceipt = await waitForTransactionReceipt(config, { hash: secondHash });

      // if (lpTokenSecondFunctionIsSuccess) {
      console.log("Second function successful: ", secondReceipt);
      const currentUnixTime = Math.floor(Date.now() / 1000);
      const duelId= uuidv4()
      // get this from reciept
      const duelData = {
        duelId: duelId,
        type: "FLASH_DUEL",
        category: categoryEnum,
        betString: formData.betAmount,
        betIcon: formData.betIcon,
        endsIn: durations[durationNumber],
        createdAt: currentUnixTime,
      };

      // Send request to your backend
      const response = await axios.post(
        `${NEXT_PUBLIC_API}/duels/create`,
        {
          ...duelData,
          twitterUsername: user?.twitter?.username,
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
        duelId: duelId,
        duelType: 'FLASH_DUEL',
        duration: durations[durationNumber] ,
        startTime: currentUnixTime,
        category: categoryEnum
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error("Error: ", error);
    }
  };




  // after these send all these as parameters in the createDuel function

  // console.log("Call BE", duelId, createdAt, description, formData.category, formData.betAmount, formData.betIcon, formData.duration);



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
