"use client"
import React, { useEffect } from "react";
import Logo from "./Logo";
import Navbar from "./Navbar";
import { useAccount, useDisconnect } from "wagmi";
import { useBalance } from "@/blockchain/useBalance";
// import { usePrivy } from "@privy-io/react-auth";
import { priceIds } from "@/utils/helper";
import { usePriceStream } from "../PriceStream";
import { watchAccount } from "@wagmi/core";
import { config } from "@/app/config/wagmi";
import { usePathname, useRouter } from "next/navigation";
import { useAtom } from "jotai/react";
import { setupInterceptors } from "@/utils/apiClient";
import { isSigningKeyValid } from "@/utils/sign";
import { estConnection } from "@/utils/atoms";
import Navigation from "./Navigation";

const Header: React.FC = () => {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const pathname = usePathname();
  const { disconnect } = useDisconnect();

  const isPath = pathname === `/`;
  // const { disconnect } = useDisconnect();
  // const { logout } = usePrivy();
  const { balance, refetch } = useBalance(address as string);

  const ids = priceIds.map(item => Object.values(item)[0]);
  usePriceStream(ids);

  const [establishConnection, setEstablishConnection] = useAtom(estConnection);
  console.log(establishConnection, "establishConnection")
  useEffect(() => {
    if (address) {
      setupInterceptors(address.toLowerCase(), disconnect, setEstablishConnection);
    }
  }, [address]);

  const handleSignTypedData = async (address: string) => {
    if (address) {
      const type = await isSigningKeyValid(disconnect, address?.toLowerCase(), setEstablishConnection);
      if (!type.type && !type.statement) {
        setEstablishConnection(true)
        // showPopup();
      }
    }
  };

  useEffect(() => {
    const unwatch = watchAccount(config, {
      onChange: async (newAccount, prevAccount) => {
        // If the previous account exists and is different from the new account, disconnect it
        if (prevAccount?.address && prevAccount.address !== newAccount?.address) {
          console.log(`Disconnecting previous account: ${prevAccount.address} balance: ${balance}`);
          disconnect();
          setEstablishConnection(true)

          if (newAccount?.address) {
            await handleSignTypedData(newAccount.address as string);
            await setupInterceptors((newAccount.address as string).toLowerCase(), disconnect, setEstablishConnection);

          }
          refetch()
        }

        // If the new account exists, set up interceptors and handle sign data
        else if (newAccount?.address) {
          refetch()
          console.log("herehere")
          console.log(`Connecting new account: ${newAccount.address} balance: ${balance}`);
          await handleSignTypedData(newAccount.address);
          await setupInterceptors(newAccount.address.toLowerCase(), disconnect, setEstablishConnection);

          // Optionally, reload the page after successful connection and signing
          // window.location.reload();
        }
        refetch()
      }
    });

    return () => {
      unwatch(); // Clean up when component unmounts
    };
  }, [address, config]);

  

  return (
    <header className="flex w-full h-[107px] px-[50px] justify-between items-center flex-shrink-0 border-b-2 border-gray-500 border-opacity-20">
    <div className="flex flex-row gap-x-4 items-center">
      <Logo />
      <button
        onClick={() => router.push("/")}
        className={`text-base leading-5 font-normal ${
          isPath
            ? "text-[var(--text-pink,#F19ED2)]"
            : "text-[rgba(243,239,224,0.60)]"
        } cursor-pointer`}
      >
        Markets
      </button>
      <Navigation pathname={"leaderboard"} />
      {isConnected && <Navigation pathname={"portfolio"} />}
    </div>
    <Navbar />
  </header>
  
  );
};
export default Header;