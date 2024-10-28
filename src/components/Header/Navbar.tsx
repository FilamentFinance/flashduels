"use client"
import React, { useState } from "react";
import Navigation from "./Navigation";
import DepositButton from "./DepositButton";
import CreateDuelButton from "./CreateDuelButton";
import UserProfile from "./UserProfile";
import SettingsIcon from "./SettingsIcon";
import { usePrivy } from "@privy-io/react-auth";
import DepositModal from "../DepositModal/DepositModal";
import IconButtonContainer from "./IconButton";

const Navbar: React.FC = () => {
    const {authenticated} = usePrivy();
    const [isModalOpen, setModalOpen] = useState(false);

    const handleOpenModal = () => {
      setModalOpen(true);
    };
  
    const handleCloseModal = () => {
      setModalOpen(false);
    };
  return (
  
      <nav className="flex flex-row items-center gap-x-3">
        <Navigation />
       {authenticated && <DepositButton onOpenModal={handleOpenModal} />}
       {isModalOpen && <DepositModal onClose={handleCloseModal} />}
       <IconButtonContainer/>
        {authenticated && <CreateDuelButton />}
        <UserProfile />
        {authenticated && <SettingsIcon />}
      </nav>
  
  );
};

export default Navbar;
