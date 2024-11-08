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

const Navbar: React.FC = () => {
    // const {authenticated} = usePrivy();
const {isConnected} = useAccount();
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
        <Navigation pathname = {"leaderboard"} />
        <Navigation pathname = {"portfolio"} />
       {isConnected && <DepositButton onOpenModal={handleOpenModal} />}
       {/* {isModalOpen && <DepositModal onClose={handleCloseModal} />} */}
       <IconButtonContainer/>
        {isConnected && <CreateDuelButton />}
        <UserProfile />
        {isConnected && <SettingsIcon />}
      </nav>
  
  );
};

export default Navbar;
