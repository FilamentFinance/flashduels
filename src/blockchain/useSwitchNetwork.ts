import { CHAIN_ID } from "@/utils/consts";
import {useSwitchChain } from "wagmi";

const useSwitchNetwork = () => {
  const { switchChain } = useSwitchChain()


  const handleNetworkChange = async () => {
    switchChain({ chainId: CHAIN_ID })
  };

  return { handleNetworkChange };
};

export default useSwitchNetwork;
