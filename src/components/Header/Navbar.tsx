"use client"
import React from "react";
import Navigation from "./Navigation";
import DepositButton from "./DepositButton";
import CreateDuelButton from "./CreateDuelButton";
import UserProfile from "./UserProfile";
import SettingsIcon from "./SettingsIcon";
// import { usePrivy } from "@privy-io/react-auth";
// import DepositModal from "../DepositModal/DepositModal";
import IconButtonContainer from "./IconButton";
import { useAccount, useSwitchChain } from "wagmi";
import { CHAIN_ID } from "@/utils/consts";


const Navbar: React.FC = () => {
  // const {authenticated} = usePrivy();
  const { isConnected, chainId } = useAccount();
  const { switchChain } = useSwitchChain()
  // const [isModalOpen, setModalOpen] = useState(false);
  // 
  const handleOpenModal = () => {
    // setModalOpen(true);
  };

  // const handleCloseModal = () => {
  // setModalOpen(false);
  // };
  return (

    <nav className="flex flex-row items-center gap-x-3">
      {/* <Navigation pathname = {""} /> */}
      <Navigation pathname={"leaderboard"} />
      {isConnected && chainId === CHAIN_ID && <Navigation pathname={"portfolio"} />}
      {isConnected && <DepositButton onOpenModal={handleOpenModal} />}
      {/* {isModalOpen && <DepositModal onClose={handleCloseModal} />} */}
      <IconButtonContainer />
      {isConnected && chainId === CHAIN_ID && <CreateDuelButton />}
      {chainId === CHAIN_ID ?
        <UserProfile /> :
        <button
          onClick={() => switchChain({ chainId: CHAIN_ID })}
          className="gap-2.5 self-stretch px-3 py-2.5 my-auto text-base font-semibold leading-none text-gray-900 rounded shadow-sm bg-[linear-gradient(180deg,#F19ED2_0%,#C87ECA_100%)]"
        >Switch Network</button>}
      {isConnected && <SettingsIcon />}
    </nav>

  );
};

export default Navbar;
