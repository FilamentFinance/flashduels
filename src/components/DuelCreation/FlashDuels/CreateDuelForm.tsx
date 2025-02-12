"use client"
import React, { useState } from "react";
import CategorySelect from "./CategorySelect";
import BetInput from "./BetInput";
import BetIconUpload from "./BetIconUpload";
import DurationSelect from "./DurationSelect";
import InfoBox from "./InfoBox";
import SubmitButton from "./SubmitButton";
import { useAccount, useWriteContract } from "wagmi";
import { CHAIN_ID, durations, NEXT_PUBLIC_API, NEXT_PUBLIC_DIAMOND, NEXT_PUBLIC_FLASH_USDC } from "@/utils/consts";
// import { FLASHUSDCABI } from "@/abi/FLASHUSDC";
import { waitForTransactionReceipt } from "wagmi/actions";
import { config } from "@/app/config/wagmi";
// import { FLASHDUELSABI } from "@/abi/FLASHUSDC";
import { mapCategoryToEnumIndex, mapDurationToNumber } from "@/utils/helper";
import axios from "axios";
// import { usePrivy } from "@privy-io/react-auth";
import { useBalance } from "@/blockchain/useBalance";
import { GeneralNotificationAtom } from "@/components/GeneralNotification";
import { useAtom } from "jotai";
import { apiClient } from "@/utils/apiClient";
import { FLASHDUELS_CORE_ABI } from "@/abi/FlashDuelsCoreFacet";
import { FLASHUSDCABI } from "@/abi/FLASHUSDC";

const CreateDuelForm = ({ closeDuelModal }: { closeDuelModal: () => void }) => {
  const {address} = useAccount()
  const {refetch} = useBalance(address as string);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [notification, setNotification] = useAtom(GeneralNotificationAtom);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  console.log(notification)

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
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Display the preview
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result && !uploading) {
          setPreviewImage(reader.result as string);
        }
      };
      reader.readAsDataURL(file);

      // Fetch pre-signed URL from the backend
      setUploading(true);
      try {
        const { data } = await apiClient.post(`${NEXT_PUBLIC_API}/aws/generate-presigned-url`, {
          fileName: file.name,
          fileType: file.type,
        });
        const { url } = data;
        console.log("Received a pre-signed URL:", url);

        // Upload file to S3 using the pre-signed URL
        const response = await axios.put(url, file, {
          headers: { 'Content-Type': file.type },
        });
        console.log(response);

        setFormData({
          ...formData,
          betIcon: `https://flashduel-images.s3.us-east-1.amazonaws.com/uploads/${file.name}`,
        });
        console.log("File uploaded successfully");
      } catch (error) {
        console.error("File upload failed:", error);
      } finally {
        setUploading(false);
      }
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
      args: [NEXT_PUBLIC_DIAMOND, 5 * 10 ** 6],
    });

  // Function to call the second contract function
  const lpTokenSecondFunctionAsync = (topic: string, category: number, duration: number, options: string[]) =>
    lpTokenSecondFunctionAsyncLocal({
      abi: FLASHDUELS_CORE_ABI,
      address: NEXT_PUBLIC_DIAMOND as `0x${string}`,
      functionName: "requestCreateDuel",
      chainId: CHAIN_ID,
      args: [category, topic, options, duration],
    });


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // const gasPrice = await getGasPrice(config)

    try {
      const hash = await lpTokenApproveAsync();
      await waitForTransactionReceipt(config, { hash });

      const categoryEnumIndex = mapCategoryToEnumIndex(formData.category);
      const durationNumber = mapDurationToNumber(formData.duration);
      const options = ["YES", "NO"];

      const secondHash = await lpTokenSecondFunctionAsync(formData.betAmount, categoryEnumIndex, durationNumber, options);
      await waitForTransactionReceipt(config, { hash: secondHash });

      // if (lpTokenSecondFunctionIsSuccess) {
      // console.log("Second function successful: ", secondReceipt.logs[1].transactionHash);

      // const result = await fetchTransactionEvents(secondReceipt.logs[1].transactionHash)

      // if (!result) {
      //   console.error('Error fetching transaction events');
      //   return;
      // }
      const duelData = {
        // duelId: result.duelId,
        type: "FLASH_DUEL",
        category: formData.category === "" ? "Any" : formData.category,
        betString: formData.betAmount,
        betIcon: formData.betIcon,
        endsIn: durations[durationNumber],
        // createdAt: result.createTime,
      };
      // Send request to your backend
      await apiClient.post(
        `${NEXT_PUBLIC_API}/duels/approve`,
        {
          ...duelData,
          twitterUsername: "",
          address: address?.toLowerCase(),
        },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      console.log("making response to timerbot")

      // await axios.post(`${NEXT_PUBLIC_TIMER_BOT_URL}/startDuel`, {
      //   duelId: result.duelId,
      //   duelType: 'FLASH_DUEL',
      //   duration: durations[durationNumber],
      //   startTime: result.createTime,
      //   category: categoryEnumIndex
      // }, {
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      // });
      setNotification({
        isOpen: true,
        success: true,
        massage: "Created Flash Duel",
      });
    } catch (error) {
      setNotification({
        isOpen: true,
        success: false,
        massage: "Failed to Create Flash Duel",
      });
      console.error("Error: ", error);
    }finally{
      setLoading(false)
      closeDuelModal()
      refetch()
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
        <BetIconUpload name="betIcon" value={formData.betIcon} handleFileChange={handleFileChange} previewImage={previewImage} uploading={uploading} />
        <DurationSelect name="duration" value={formData.duration} onChange={handleInputChange} />
        <InfoBox />
        <SubmitButton loading={loading} uploading={uploading} />
      </div>
    </form>
  );
};

export default CreateDuelForm;
