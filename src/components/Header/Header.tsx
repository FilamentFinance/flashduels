"use client"
import React, { useEffect } from "react";
import Logo from "./Logo";
import Navbar from "./Navbar";
import { useAccount, useDisconnect } from "wagmi";
import { usePrivy } from "@privy-io/react-auth";
import { priceIds } from "@/utils/helper";
import { usePriceStream } from "../PriceStream";

const Header: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { logout } = usePrivy();

    const ids = priceIds.map(item => Object.values(item)[0]);
    usePriceStream(ids);

  useEffect(() => {
    if (!isConnected) return;

    const handleAccountChange = async () => {
      // Disconnect from Privy
      await logout();

      // Disconnect from Wagmi
      disconnect();
    };

    // Check if the account has changed
    const currentAccount = localStorage.getItem('connectedAccount');
    if (currentAccount && currentAccount !== address) {
      handleAccountChange();
    }

    // Save the current account to local storage
    localStorage.setItem('connectedAccount', address as string);
  }, [address, isConnected, disconnect]);
  return (
    <header className="flex w-full h-[107px] px-[50px] justify-between items-center flex-shrink-0 border-b-2 border-gray-500 border-opacity-20">
      <Logo />
      <Navbar></Navbar>
      {/* <button onClick={async () => { await fundWallet(user?.wallet?.address as string); }}>hello</button> */}
    </header>
  );
};
export default Header;