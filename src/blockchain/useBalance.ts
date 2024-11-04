import { FLASHUSDCABI } from "@/abi/FLASHUSDC";
import { CHAIN_ID, NEXT_PUBLIC_FLASH_USDC } from "@/utils/consts";
import { useReadContract } from "wagmi";

export const useBalance = (address: string) => {
  const {
    data: balance,
    isLoading,
    isError,
    refetch,
  } = useReadContract({
    abi: FLASHUSDCABI,
    functionName: "balanceOf",
    address: NEXT_PUBLIC_FLASH_USDC as `0x${string}`,
    chainId: CHAIN_ID,
    args: [address],
  });

  return { balance, isLoading, isError, refetch };
};
