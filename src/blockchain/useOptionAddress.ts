import { FLASHDUELS_VIEWFACET } from "@/abi/FlashDuelsViewFacet";
// import { FLASHUSDCABI } from "@/abi/FLASHUSDC";
import { CHAIN_ID, NEXT_PUBLIC_DIAMOND } from "@/utils/consts";
import { useReadContract } from "wagmi";

export const useOptionAddress = (duelId: string, optionIndex: number) => {
    const { data: optionTokenAddressData } = useReadContract({
        abi: FLASHDUELS_VIEWFACET,
        functionName: "getOptionIndexToOptionToken",
        address: NEXT_PUBLIC_DIAMOND as `0x${string}`,
        chainId: CHAIN_ID,
        args: [duelId, optionIndex],
      })

  return { optionTokenAddressData };
};
