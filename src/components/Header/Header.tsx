"use client"
import React, { useEffect } from "react";
import Logo from "./Logo";
import Navbar from "./Navbar";
import { useAccount} from "wagmi";
import { useBalance } from "@/blockchain/useBalance";
// import { usePrivy } from "@privy-io/react-auth";
import { priceIds } from "@/utils/helper";
import { usePriceStream } from "../PriceStream";
import { watchAccount } from "@wagmi/core";
import { config } from "@/app/config/wagmi";

const Header: React.FC = () => {
  const { address } = useAccount();
  // const { disconnect } = useDisconnect();
  // const { logout } = usePrivy();
  const {balance, refetch} = useBalance(address as string);

  const ids = priceIds.map(item => Object.values(item)[0]);
  usePriceStream(ids);

  // function clearAllIndexedDBs() {
  //   indexedDB.databases().then((databases) => {
  //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //     //@ts-expect-error
  //     databases.forEach((db: any) => {
  //       const deleteRequest = indexedDB.deleteDatabase(db.name);
  //       deleteRequest.onsuccess = function () {
  //         console.log(`Deleted IndexedDB: ${db.name}`);
  //       };
  //     });
  //   });
  // }

  useEffect(() => {
    const unwatch = watchAccount(config, {
      onChange: async (newAccount, prevAccount) => {
        // If the previous account exists and is different from the new account, disconnect it
        if (prevAccount?.address && prevAccount.address !== newAccount?.address) {
          console.log(`Disconnecting previous account: ${prevAccount.address} balance: ${balance}`);
          // disconnect();  
          // setEstablishConnection(true)

          if (newAccount?.address) {
          // await handleSignTypedData(newAccount.address as string);
          // await setupInterceptors((newAccount.address as string).toLowerCase(), disconnect, establishConnection);
          
          }
          refetch()
        }
  
        // If the new account exists, set up interceptors and handle sign data
        else if (newAccount?.address) {
          refetch()
          console.log("herehere")
          console.log(`Connecting new account: ${newAccount.address} balance: ${balance}`);
          // await handleSignTypedData(newAccount.address);
          // await setupInterceptors(newAccount.address.toLowerCase(), disconnect, establishConnection);
          
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

  // window.addEventListener('beforeunload', clearAllIndexedDBs);
  // useEffect(() => {
  //   if (!isConnected) return;

  //   const handleAccountChange = async () => {
  //     // Disconnect from Privy
  //     await logout();

  //     // Disconnect from Wagmi
  //     disconnect();
  //   };

  //   // Check if the account has changed
  //   const currentAccount = localStorage.getItem('connectedAccount');
  //   if (currentAccount && currentAccount !== address) {
  //     handleAccountChange();
  //   }

  //   // Save the current account to local storage
  //   localStorage.setItem('connectedAccount', address as string);
  // }, [address, isConnected, disconnect]);
  return (
    <header className="flex w-full h-[107px] px-[50px] justify-between items-center flex-shrink-0 border-b-2 border-gray-500 border-opacity-20">
      <Logo />
      <Navbar></Navbar>
      {/* <button onClick={async () => { await fundWallet(user?.wallet?.address as string); }}>hello</button> */}
    </header>
  );
};
export default Header;