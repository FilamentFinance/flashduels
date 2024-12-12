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
import { useAccount } from "wagmi";
// import { CHAIN_ID } from "@/utils/consts";
import { RewardCard } from "../rewards/RewardCard";
import { estConnection } from "@/utils/atoms";
import { useAtom } from "jotai";
import usePopup from "@/app/providers/PopupProvider";


const Navbar: React.FC = () => {
  // const {authenticated} = usePrivy();
  const { isConnected } = useAccount();
  const {showPopup} = usePopup()
  // const { switchChain } = useSwitchChain()
  // const [isModalOpen, setModalOpen] = useState(false);
  // 
  const handleOpenModal = () => {
    // setModalOpen(true);
  };

  // const handleCloseModal = () => {
  // setModalOpen(false);
  // };
  const [establishConnection] = useAtom(estConnection)
  console.log(establishConnection, "establishConnection")

  return (

    <nav className="flex flex-row items-center gap-x-3">
      <Navigation pathname={"leaderboard"} />
      {isConnected && <Navigation pathname={"portfolio"} />}
     {isConnected && <RewardCard/>}
      {isConnected && <DepositButton onOpenModal={handleOpenModal} />}
      {/* {isModalOpen && <DepositModal onClose={handleCloseModal} />} */}
     { isConnected && <IconButtonContainer />}
      {isConnected && !establishConnection && <CreateDuelButton />}
       <UserProfile />
       {isConnected && establishConnection &&
            <button
             className="gap-2.5 self-stretch px-3 py-2.5 my-auto text-base font-semibold leading-none text-gray-900 rounded shadow-sm bg-[linear-gradient(180deg,#F19ED2_0%,#C87ECA_100%)]"
             onClick={showPopup}
            >
              Enable Trading
            </button>
        }
      {isConnected && <SettingsIcon />}
    </nav>

  );
};

export default Navbar;
